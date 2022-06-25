const app = require('./app');
const serverless = require('serverless-http');

const handler = serverless(app);
module.exports.request = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const result = await handler(event, context);
  return result;
};
