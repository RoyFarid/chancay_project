const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

/**
 * Middleware Configuration
 */

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Puerto de Chancay Logistics Orchestrator API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 * All routes are mounted under /api prefix
 */
app.use('/api', apiRoutes);

/**
 * 404 Handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;

