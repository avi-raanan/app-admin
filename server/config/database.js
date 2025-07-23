// נתיב: server/config/database.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'AssetManagement',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Use this if you're on Windows Azure
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true', // Use this if you're on a local instance
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

const getConnection = async () => {
  try {
    if (!poolPromise) {
      poolPromise = new sql.ConnectionPool(config).connect();
    }
    
    const pool = await poolPromise;
    console.log('✅ Connected to SQL Server database');
    return pool;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
};

const closeConnection = async () => {
  try {
    if (poolPromise) {
      const pool = await poolPromise;
      await pool.close();
      poolPromise = null;
      console.log('🔌 Database connection closed');
    }
  } catch (err) {
    console.error('❌ Error closing database connection:', err.message);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT 1 as test');
    console.log('🧪 Database test successful:', result.recordset);
    return true;
  } catch (err) {
    console.error('🧪 Database test failed:', err.message);
    return false;
  }
};

module.exports = {
  sql,
  getConnection,
  closeConnection,
  testConnection,
  config
};