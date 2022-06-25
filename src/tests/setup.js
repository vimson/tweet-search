const resolve = require('path').resolve;
const dotenv = require('dotenv');
process.env.stage = 'dev';

exports.setUp = () => {
  require('dotenv').config({ path: resolve('./src/configs/.env.dev') });
};
