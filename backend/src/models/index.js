/**
 * Sequelize Models Index
 * Initializes and exports all database models
 */

const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging
    }
);

const User = require('./User');
const History = require('./History');

User.init(sequelize);
History.init(sequelize);

User.associate(sequelize.models);
History.associate(sequelize.models);

module.exports = {
    sequelize,
    User,
    History
};
