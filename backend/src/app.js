require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const freightRoutes = require('./routes/freightRoutes');
const historyRoutes = require('./routes/historyRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/freight', freightRoutes);
app.use('/history', historyRoutes);
app.use('/integrations', integrationRoutes);

// Log all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server
const db = require('./models');

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 FreteMaster Backend running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    });
}).catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
    // Em produção, talvez queiramos iniciar o servidor mesmo sem banco para health checks,
    // mas por enquanto vamos deixar falhar para ver o erro no log.
});

module.exports = app;
