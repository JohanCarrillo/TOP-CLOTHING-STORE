'use strict'

const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load environment variables
const envVars = dotenv.config();
if (envVars.error) throw('error loading env files: ', envVars.error);

// load routers
const indexRouter = require('./routes/index');
const itemRouter = require('./routes/item');
const itemInstanceRouter = require('./routes/itemInstance');
const clothCollectionRouter = require('./routes/clothCollection');
const categoryRouter = require('./routes/category');

// database connection
const mongoDB = process.env.MONGODBCONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// initialize app
const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

// ldefined routes
app.use('/', indexRouter);
app.use('/item', itemRouter);
app.use('/instance', itemInstanceRouter);
app.use('/category', categoryRouter);
app.use('/collection', clothCollectionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
