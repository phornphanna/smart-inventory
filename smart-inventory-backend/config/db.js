const mysql = require('mysql2/promise');

// Create a connection pool to reuse database connections 
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smart_inventory",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;