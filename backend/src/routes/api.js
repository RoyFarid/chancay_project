const express = require('express');
const router = express.Router();
const slotsController = require('../controllers/slotsController');
const bookingController = require('../controllers/bookingController');

/**
 * API Root Endpoint
 * Returns information about available endpoints
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Puerto de Chancay Logistics Orchestrator API',
    version: '1.0.0',
    endpoints: {
      slots: {
        method: 'GET',
        path: '/api/slots',
        description: 'Get all available time slots'
      },
      bookings: {
        method: 'POST',
        path: '/api/bookings',
        description: 'Create a new booking',
        body: {
          slot_id: 'number (required)',
          user_id: 'string (required)',
          truck_plate: 'string (required)'
        }
      }
    }
  });
});

/**
 * Time Slots Routes
 */
router.get('/slots', slotsController.getAvailableSlots);

/**
 * Booking Routes
 */
router.post('/bookings', bookingController.createBooking);

module.exports = router;

