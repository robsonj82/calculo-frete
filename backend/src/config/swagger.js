const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FreteMaster API',
            version: '1.0.0',
            description: 'API para cálculo, comparação e gestão de fretes.',
            contact: {
                name: 'Suporte FreteMaster',
                email: 'suporte@fretemaster.com.br'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
