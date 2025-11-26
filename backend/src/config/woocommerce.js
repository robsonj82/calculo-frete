require('dotenv').config();

module.exports = {
    url: process.env.WC_BASE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: 'wc/v3'
};
