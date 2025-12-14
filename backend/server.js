require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

/**
 * Start the Express server
 */
const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║  Puerto de Chancay Logistics Orchestrator               ║
  ║  Virtual Gate System - Backend API                      ║
  ╠══════════════════════════════════════════════════════════╣
  ║  Server running on port ${PORT}                            ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
  ╚══════════════════════════════════════════════════════════╝
  `);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

/**
 * Graceful shutdown handler
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

