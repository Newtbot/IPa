const swaggerJSDoc = require('swagger-jsdoc');

// app.js
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentation for IPA.wtf',
    version: '1.0.0',
    description:
      'This is the documentation page for the IPA.wtf API. This page is for developers to understand the API and how to use it.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },

  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['../routes/api.js'],
};
//routes\api.js
const swaggerSpec = swaggerJSDoc(options);


module.exports = { swaggerSpec } 