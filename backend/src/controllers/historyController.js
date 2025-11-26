const { History, User } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const logHistory = (userId, action, details) => {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        user_id: userId,
        action,
        details
    };

    fs.appendFile(
        path.join(logDir, 'history.log'),
        JSON.stringify(logEntry) + '\n',
        (err) => {
            if (err) console.error('Error writing to history log:', err);
        }
    );
};

const create = async (req, res) => {
    try {
        const { origin, destination, weight, dimensions, value, carrier, service, price, deadline } = req.body;
        const userId = req.user.id; // From authMiddleware

        const history = await History.create({
            user_id: userId,
            origin,
            destination,
            weight,
            dimensions,
            value,
            carrier,
            service,
            price,
            deadline
        });

        logHistory(userId, 'CREATE', { history_id: history.id, carrier });

        res.status(201).json({
            status: 'success',
            data: history
        });
    } catch (error) {
        console.error('History create error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao salvar histórico'
        });
    }
};

const list = async (req, res) => {
    try {
        const { carrier, start_date, end_date } = req.query;
        const userId = req.user.id;

        const where = { user_id: userId };

        if (carrier) {
            where.carrier = carrier;
        }

        if (start_date || end_date) {
            where.createdAt = {};
            if (start_date) where.createdAt[Op.gte] = new Date(start_date);
            if (end_date) where.createdAt[Op.lte] = new Date(new Date(end_date).setHours(23, 59, 59));
        }

        const history = await History.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: history
        });
    } catch (error) {
        console.error('History list error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao listar histórico'
        });
    }
};

const exportCsv = async (req, res) => {
    try {
        const { carrier, start_date, end_date } = req.query;
        const userId = req.user.id;

        const where = { user_id: userId };

        if (carrier) {
            where.carrier = carrier;
        }

        if (start_date || end_date) {
            where.createdAt = {};
            if (start_date) where.createdAt[Op.gte] = new Date(start_date);
            if (end_date) where.createdAt[Op.lte] = new Date(new Date(end_date).setHours(23, 59, 59));
        }

        const history = await History.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        // Generate CSV
        const header = 'Data,Origem,Destino,Transportadora,Serviço,Preço,Prazo\n';
        const rows = history.map(h => {
            const date = new Date(h.createdAt).toLocaleDateString('pt-BR');
            return `${date},${h.origin},${h.destination},${h.carrier},${h.service},${h.price},${h.deadline}`;
        }).join('\n');

        const csvContent = header + rows;

        logHistory(userId, 'EXPORT', { count: history.length });

        res.header('Content-Type', 'text/csv');
        res.attachment('historico_fretes.csv');
        res.send(csvContent);

    } catch (error) {
        console.error('History export error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao exportar histórico'
        });
    }
};

module.exports = {
    create,
    list,
    exportCsv
};
