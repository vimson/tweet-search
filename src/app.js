const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/configs/.env.${process.env.stage}` });
const express = require('express');
const { checkAuth } = require('./middlewares/auth.middleware');
const { dbAvailability } = require('./middlewares/service-check.middleware');
require('express-async-errors');

const {
  logErrors,
  clientErrorHandler,
  errorHandler,
  resourceNotFound,
} = require('./middlewares/errors.middleware');
const tweetRouter = require('./routes/tweets.route');

const app = express();

app.use(dbAvailability);
app.use(checkAuth);

app.use('/', tweetRouter);
app.get('*', resourceNotFound);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

module.exports = app;
