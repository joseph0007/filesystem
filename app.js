const path = require('path');
const express = require('express');
const morgan = require('morgan');

const fileRouter = require('./routes/fileRoutes');
const AppError = require('./utils/appError');
const authHandler = require('./controllers/authController');
const appErrorHandler = require('./controllers/errorController');

const app = express();

app.use(
  express.json({
    limit: '100mb',
  })
);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ROUTES
app.post('/api/v1/login', authHandler.logIn);
app.use('/api/v1/file', fileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server!!`, 404));
});

app.use(appErrorHandler);

module.exports = app;
