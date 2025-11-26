require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'fretemaster',
    password: process.env.DB_PASS || 'fretemaster_pass',
    database: process.env.DB_NAME || 'fretemaster',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    storage: process.env.DB_STORAGE, // For SQLite
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
};
