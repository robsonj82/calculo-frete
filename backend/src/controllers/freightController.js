/**
 * Freight Controller
 * Handles freight calculation across multiple carriers
 */

const fs = require('fs');
const path = require('path');
const correiosService = require('../services/correiosService');
const jadlogService = require('../services/jadlogService');
const braspressService = require('../services/braspressService');
const saomiguelService = require('../services/saomiguelService');
const logger = require('../utils/logger');
const cacheService = require('../services/cacheService');

/**
 * @swagger
 * /freight/calculate:
 *   post:
 *     summary: Calcula o frete em múltiplas transportadoras
 *     tags: [Frete]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - weight
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               weight:
 *                 type: number
 *               height:
 *                 type: number
 *               width:
 *                 type: number
 *               length:
 *                 type: number
 *               declared_value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lista de cotações
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro no servidor
 */
const calculate = async (req, res) => {
    try {
        const params = req.body;
        const { origin, destination, weight, height, width, length, declared_value } = params;

        // Basic validation
        if (!origin || !destination || !weight) {
            return res.status(400).json({
                status: 'error',
                message: 'Parâmetros obrigatórios: origin, destination, weight'
            });
        }

        // Check Cache
        const cacheKey = cacheService.generateKey(params);
        const cachedResult = cacheService.get(cacheKey);
        if (cachedResult) {
            return res.status(200).json({
                status: 'success',
                data: cachedResult,
                fromCache: true
            });
        }

        // Call all services in parallel
        const services = [
            correiosService.calculateFreight(params),
            jadlogService.calculateFreight(params),
            braspressService.calculateFreight(params),
            saomiguelService.calculateFreight(params)
        ];

        const results = await Promise.all(services);

        // Filter out errors and standardize response
        const validResults = results.filter(r => !r.error);

        // Log the quote
        logger.info({ type: 'FREIGHT_CALCULATION', params, results: validResults });

        // Save to Cache
        cacheService.set(cacheKey, validResults);

        res.status(200).json({
            status: 'success',
            data: validResults
        });

    } catch (error) {
        logger.error(`Freight calculation error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao calcular frete',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    calculate
};
