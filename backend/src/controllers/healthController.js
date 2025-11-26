/**
 * Health Check Controller
 * Provides endpoints to verify API and database status
 */

const ping = (req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        service: 'FreteMaster API'
    });
};

const health = async (req, res) => {
    try {
        // Real database check
        const { sequelize } = require('../models');
        await sequelize.authenticate();

        const dbStatus = {
            connected: true,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT
        };

        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'FreteMaster API',
            database: dbStatus,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

module.exports = {
    ping,
    health
};
