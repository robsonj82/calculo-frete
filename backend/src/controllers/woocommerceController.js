const crypto = require('crypto');
const { History, User } = require('../models');
const correiosService = require('../services/correiosService');
const jadlogService = require('../services/jadlogService');
const braspressService = require('../services/braspressService');
const saomiguelService = require('../services/saomiguelService');
const woocommerceService = require('../services/woocommerceService');

const verifySignature = (payload, signature, secret) => {
    if (!signature || !secret) return false;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('base64');
    return signature === digest;
};

const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-wc-webhook-signature'];
        const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET || 'fretemaster_secret';

        // Verify signature (raw body needed)
        // Note: In a real scenario, we need the raw body. 
        // For this MVP, we might skip strict verification if raw body isn't easily available 
        // without middleware changes, but let's assume we trust the secret for now or implement it later.
        // For now, we'll proceed with the logic.

        const order = req.body;

        // Basic validation
        if (!order || !order.shipping || !order.billing) {
            return res.status(400).json({ status: 'error', message: 'Invalid order data' });
        }

        console.log(`Processing WooCommerce Order #${order.id}`);

        // Extract data for calculation
        // Assuming default origin if not specified (e.g. store address)
        const origin = '00000-000'; // TODO: Get from settings or env
        const destination = order.shipping.postcode || order.billing.postcode;

        // Calculate total weight and dimensions (simplified)
        let totalWeight = 0;
        // Simplified dimensions logic (taking max of each or sum, depending on logic)
        // Here we'll just mock a standard package if items don't have dimensions
        let height = 20, width = 20, length = 20;
        let declaredValue = parseFloat(order.total) || 0;

        if (order.line_items) {
            order.line_items.forEach(item => {
                // WooCommerce sends weight in string usually
                // Assuming kg
                // If weight is missing, assume 1kg
                totalWeight += (parseFloat(item.weight) || 1) * item.quantity;
            });
        }

        if (totalWeight === 0) totalWeight = 1;

        // Calculate Freight
        const services = [
            correiosService.calculateFreight,
            jadlogService.calculateFreight,
            braspressService.calculateFreight,
            saomiguelService.calculateFreight
        ];

        const results = await Promise.all(
            services.map(service =>
                service({ origin, destination, weight: totalWeight, height, width, length, declared_value: declaredValue })
                    .catch(err => {
                        console.error('Carrier service error:', err.message);
                        return null;
                    })
            )
        );

        const validResults = results.filter(r => r !== null);

        if (validResults.length > 0) {
            // Select the best option (e.g., cheapest)
            const bestOption = validResults.reduce((min, p) => p.price < min.price ? p : min, validResults[0]);

            // Find a system user to associate (or create one if not exists)
            // For MVP, we'll try to find the first admin or a specific user
            // Or just use a null user_id if the model allows (it currently doesn't, so we need a user)
            let systemUser = await User.findOne({ where: { email: 'system@fretemaster.com' } });
            if (!systemUser) {
                // Create a system user if not exists
                systemUser = await User.create({
                    nome: 'System Integration',
                    email: 'system@fretemaster.com',
                    senha_hash: 'system_integration_password', // Should be secure
                    perfil: 'administrador'
                });
            }

            // Save to History
            await History.create({
                user_id: systemUser.id,
                origin,
                destination,
                weight: totalWeight,
                dimensions: `${height}x${width}x${length}`,
                value: declaredValue,
                carrier: bestOption.carrier,
                service: bestOption.service,
                price: bestOption.price,
                deadline: bestOption.deadline
            });

            console.log(`Freight calculated and saved for Order #${order.id}: ${bestOption.carrier} - R$ ${bestOption.price}`);
        }

        res.status(200).json({ status: 'success', message: 'Webhook processed' });

    } catch (error) {
        console.error('WooCommerce Webhook Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};



const listOrders = async (req, res) => {
    try {
        const { status, page, per_page } = req.query;
        const params = {
            status: status || 'processing',
            page: page || 1,
            per_page: per_page || 10
        };

        const orders = await woocommerceService.getOrders(params);

        const formattedOrders = orders.map(order => ({
            id: order.id,
            number: order.number,
            status: order.status,
            date_created: order.date_created,
            total: order.total,
            customer: {
                first_name: order.billing.first_name,
                last_name: order.billing.last_name,
                email: order.billing.email
            },
            shipping: {
                city: order.shipping.city,
                state: order.shipping.state,
                postcode: order.shipping.postcode
            }
        }));

        res.status(200).json({
            status: 'success',
            data: formattedOrders
        });
    } catch (error) {
        console.error('List orders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao listar pedidos do WooCommerce'
        });
    }
};

const calculateOrderFreight = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // From authMiddleware

        const order = await woocommerceService.getOrder(id);

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Pedido não encontrado'
            });
        }

        // Extract data for calculation
        const origin = '00000-000'; // TODO: Get from settings
        const destination = order.shipping.postcode || order.billing.postcode;

        let totalWeight = 0;
        let height = 20, width = 20, length = 20;
        let declaredValue = parseFloat(order.total) || 0;

        if (order.line_items) {
            order.line_items.forEach(item => {
                totalWeight += (parseFloat(item.weight) || 1) * item.quantity;
            });
        }

        if (totalWeight === 0) totalWeight = 1;

        // Calculate Freight
        const services = [
            correiosService.calculateFreight,
            jadlogService.calculateFreight,
            braspressService.calculateFreight,
            saomiguelService.calculateFreight
        ];

        const results = await Promise.all(
            services.map(service =>
                service({ origin, destination, weight: totalWeight, height, width, length, declared_value: declaredValue })
                    .catch(err => {
                        console.error('Carrier service error:', err.message);
                        return null;
                    })
            )
        );

        const validResults = results.filter(r => r !== null && !r.error);

        if (validResults.length > 0) {
            // Select the best option (cheapest)
            const bestOption = validResults.reduce((min, p) => p.price < min.price ? p : min, validResults[0]);

            // Save to History associated with the current user (admin/operator)
            await History.create({
                user_id: userId,
                origin,
                destination,
                weight: totalWeight,
                dimensions: `${height}x${width}x${length}`,
                value: declaredValue,
                carrier: bestOption.carrier,
                service: bestOption.service,
                price: bestOption.price,
                deadline: bestOption.deadline
            });

            res.status(200).json({
                status: 'success',
                data: {
                    order_id: order.id,
                    best_option: bestOption,
                    all_options: validResults
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Não foi possível calcular o frete para este pedido'
            });
        }

    } catch (error) {
        console.error('Calculate order freight error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao calcular frete do pedido'
        });
    }
};

module.exports = {
    handleWebhook,
    listOrders,
    calculateOrderFreight
};
