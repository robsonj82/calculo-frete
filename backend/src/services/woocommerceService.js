const axios = require('axios');
const wcConfig = require('../config/woocommerce');

const api = axios.create({
    baseURL: `${wcConfig.url}/wp-json/${wcConfig.version}`,
    params: {
        consumer_key: wcConfig.consumerKey,
        consumer_secret: wcConfig.consumerSecret
    }
});

const getOrders = async (params = {}) => {
    try {
        const response = await api.get('/orders', { params });
        return response.data;
    } catch (error) {
        console.error('WooCommerce API Error (getOrders):', error.response?.data || error.message);
        throw error;
    }
};

const getOrder = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error(`WooCommerce API Error (getOrder ${id}):`, error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    getOrders,
    getOrder
};
