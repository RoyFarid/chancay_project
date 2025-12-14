const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool Configuration
 * 
 * Connection pooling allows efficient reuse of database connections,
 * reducing overhead and improving performance under high concurrency.
 */

// Check if .env file exists and has required variables
if (!process.env.DB_PASSWORD && process.env.DB_PASSWORD !== '') {
  console.warn('⚠️  WARNING: DB_PASSWORD not set in .env file');
  console.warn('   If your MySQL root user requires a password, create a .env file in the backend folder with:');
  console.warn('   DB_PASSWORD=your_password_here');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'chancay_logistics_db',
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test the database connection
 */
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connection established successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    if (error.message.includes('Access denied')) {
      console.error('\n💡 SOLUTION: Create a .env file in the backend folder with your MySQL credentials:');
      console.error('   PORT=3000');
      console.error('   DB_HOST=localhost');
      console.error('   DB_USER=root');
      console.error('   DB_PASSWORD=your_mysql_password');
      console.error('   DB_NAME=chancay_logistics_db');
    }
  });

module.exports = pool;

