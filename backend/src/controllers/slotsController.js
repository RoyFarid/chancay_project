const pool = require('../config/db');

/**
 * Get all available time slots
 * 
 * Returns slots where:
 * - status = 'OPEN'
 * - reserved_count < capacity (has available space)
 * 
 * @route GET /api/slots
 */
const getAvailableSlots = async (req, res) => {
  try {
    console.log('Fetching available slots...');
    
    const [slots] = await pool.execute(
      `SELECT 
        id,
        start_time,
        end_time,
        capacity,
        reserved_count,
        (capacity - reserved_count) as available_spots,
        status
      FROM time_slots
      WHERE status = 'OPEN' 
        AND reserved_count < capacity
      ORDER BY start_time ASC`
    );

    console.log(`Found ${slots.length} available slots`);

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Error fetching available slots:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Check for database connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(500).json({
        success: false,
        message: 'Error de conexión a la base de datos',
        error: 'No se pudo conectar a MySQL. Verifica que el servidor de base de datos esté corriendo.'
      });
    }
    
    // Check for table doesn't exist errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        message: 'Tabla no encontrada',
        error: 'La tabla time_slots no existe. Verifica que la base de datos esté configurada correctamente.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined
    });
  }
};

module.exports = {
  getAvailableSlots
};

