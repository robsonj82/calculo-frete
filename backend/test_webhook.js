const crypto = require('crypto');
const http = require('http');

const secret = 'fretemaster_secret';
const payload = JSON.stringify({
    id: 12345,
    shipping: { postcode: '88131-000' },
    billing: { postcode: '88131-000' },
    total: '150.00',
    line_items: [
        { weight: '2.0', quantity: 1 },
        { weight: '0.5', quantity: 2 }
    ]
});

const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/integrations/woocommerce/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        'x-wc-webhook-signature': signature
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(payload);
req.end();
