const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Cache for 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

const get = (key) => {
    const value = cache.get(key);
    if (value) {
        logger.info(`Cache HIT for key: ${key}`);
        return value;
    }
    return null;
};

const set = (key, value) => {
    logger.info(`Cache SET for key: ${key}`);
    return cache.set(key, value);
};

const generateKey = (params) => {
    // Create a deterministic key based on sorted params
    return JSON.stringify(params, Object.keys(params).sort());
};

module.exports = {
    get,
    set,
    generateKey
};
