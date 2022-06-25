const resolve = require('path').resolve;
const dotenv = require('dotenv');
process.env.stage = 'dev';

process.env.RATE_Limit_WindowSize = 5;
process.env.RATE_Limit_WindowLogInterval = 1;
process.env.RATE_Limit_MaxWindowRequestCount = 5;

exports.setUp = () => {
  require('dotenv').config({ path: resolve('./src/configs/.env.dev') });
};
