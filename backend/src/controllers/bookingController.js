const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Generate a random QR token for the booking
 */
const generateQRToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new booking with Transactional Logic to prevent Race Conditions
 * 
 * CRITICAL: This function uses MySQL transactions with row-level locking
 * to prevent overbooking when multiple requests try to book the same slot
 * simultaneously (high concurrency scenario).
 * 
 * Transaction Flow:
 * 1. Start Transaction - Creates an isolated context
 * 2. SELECT ... FOR UPDATE - Locks the slot row for this transaction
 * 3. Check capacity - Verify space is available (atomic check)
 * 4. Update slot - Increment reserved_count atomically
 * 5. Insert booking - Create the booking record
 * 6. Commit - Make changes permanent
 * 
 * If any step fails:
 * - Rollback - Undo all changes
 * - Return appropriate error
 * 
 * @route POST /api/bookings
 * @body {slot_id, user_id, truck_plate}
 */
const createBooking = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { slot_id, user_id, truck_plate } = req.body;

    // Log incoming request for debugging
    console.log('Booking request received:', {
      slot_id,
      user_id,
      user_id_type: typeof user_id,
      truck_plate,
      truck_plate_type: typeof truck_plate,
      truck_plate_length: truck_plate?.length,
      body: req.body
    });

    // Validate required fields
    if (!slot_id || user_id === undefined || user_id === null || !truck_plate) {
      console.error('Validation failed - missing fields:', {
        has_slot_id: !!slot_id,
        has_user_id: user_id !== undefined && user_id !== null,
        has_truck_plate: !!truck_plate
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: slot_id, user_id, and truck_plate are required'
      });
    }

    // Validate and convert user_id to integer
    // Handle both string and number inputs
    let cleanUserId;
    if (typeof user_id === 'string') {
      cleanUserId = parseInt(user_id, 10);
    } else if (typeof user_id === 'number') {
      cleanUserId = Math.floor(user_id);
    } else {
      cleanUserId = parseInt(String(user_id), 10);
    }
    
    if (isNaN(cleanUserId) || cleanUserId <= 0) {
      console.error('Validation failed - invalid user_id:', {
        original: user_id,
        type: typeof user_id,
        parsed: cleanUserId
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id: must be a positive integer',
        received: user_id,
        type: typeof user_id
      });
    }
    
    console.log('User ID validated:', {
      original: user_id,
      cleaned: cleanUserId
    });

    // Validate truck_plate format and length
    const cleanTruckPlate = String(truck_plate).trim();
    if (cleanTruckPlate.length < 1 || cleanTruckPlate.length > 50) {
      console.error('Validation failed - invalid truck_plate length:', cleanTruckPlate.length);
      return res.status(400).json({
        success: false,
        message: 'Invalid truck_plate: must be between 1 and 50 characters'
      });
    }

    // Start Transaction
    // This creates an isolated context where all operations are atomic
    await connection.beginTransaction();

    /**
     * CRITICAL: SELECT ... FOR UPDATE
     * 
     * This locks the row for the duration of the transaction.
     * Other transactions trying to access this row will wait until
     * this transaction commits or rolls back.
     * 
     * This prevents race conditions where two requests simultaneously
     * check capacity and both see available space, leading to overbooking.
     */
    const [slots] = await connection.execute(
      `SELECT id, capacity, reserved_count, status
       FROM time_slots
       WHERE id = ? AND status = 'OPEN'
       FOR UPDATE`,
      [slot_id]
    );

    // Check if slot exists and is open
    if (slots.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Time slot not found or not available'
      });
    }

    const slot = slots[0];

    // Check if there's available capacity
    // This check happens AFTER the row is locked, ensuring atomicity
    if (slot.reserved_count >= slot.capacity) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Time slot is fully booked',
        available_spots: 0
      });
    }

    /**
     * Atomic Update: Increment reserved_count
     * 
     * This update happens within the transaction, so if the booking
     * insertion fails, this will be rolled back automatically.
     */
    await connection.execute(
      `UPDATE time_slots
       SET reserved_count = reserved_count + 1
       WHERE id = ?`,
      [slot_id]
    );

    // Generate unique identifiers
    const bookingId = uuidv4();
    const qrToken = generateQRToken();

    /**
     * Insert Booking Record
     * 
     * If this fails, the transaction will rollback, undoing the
     * reserved_count increment above.
     */
    const cleanSlotId = Number(slot_id);
    
    // Validate slot_id is a valid number
    if (isNaN(cleanSlotId) || cleanSlotId <= 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid slot_id: must be a positive integer'
      });
    }
    
    console.log('Inserting booking with:', {
      bookingId,
      slot_id: cleanSlotId,
      user_id: cleanUserId,
      truck_plate: cleanTruckPlate,
      qrToken: qrToken.substring(0, 10) + '...'
    });
    
    await connection.execute(
      `INSERT INTO bookings (id, slot_id, user_id, truck_plate, qr_token, status)
       VALUES (?, ?, ?, ?, ?, 'CONFIRMED')`,
      [bookingId, cleanSlotId, cleanUserId, cleanTruckPlate, qrToken]
    );

    // Commit Transaction
    // All changes become permanent only after this point
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking_id: bookingId,
        slot_id: slot_id,
        truck_plate: truck_plate,
        qr_token: qrToken,
        status: 'CONFIRMED',
        available_spots: slot.capacity - slot.reserved_count - 1
      }
    });

  } catch (error) {
    // Rollback Transaction on any error
    // This ensures data consistency - either all operations succeed or none
    await connection.rollback();
    
    console.error('Error creating booking:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    // Check for duplicate entry or constraint violations
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Booking already exists for this combination',
        error: error.sqlMessage || error.message
      });
    }

    // Check for foreign key constraint violations
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference: The slot or user does not exist',
        error: error.sqlMessage || error.message
      });
    }

    // Check for data too long errors
    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({
        success: false,
        message: 'Data too long: One of the fields exceeds the maximum length',
        error: error.sqlMessage || error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
    });
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
};

module.exports = {
  createBooking
};

