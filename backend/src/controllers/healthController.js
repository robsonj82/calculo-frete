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
        // Mock database check for MVP
        // In production, this would check actual database connection
        const dbStatus = {
            connected: true,
            database: process.env.DB_NAME || 'fretemaster',
            host: process.env.DB_HOST || 'postgres'
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
