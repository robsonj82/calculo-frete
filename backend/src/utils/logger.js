const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        // File transport for errors
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        }),
        // Specific file for freight logs (to maintain backward compatibility/requirement)
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/freight.log'),
            level: 'info',
            format: winston.format.printf(info => {
                // Only log freight related info here if needed, or just dump everything
                // For now, let's keep it simple. If the message is an object, stringify it.
                return typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
            })
        })
    ]
});

module.exports = logger;
