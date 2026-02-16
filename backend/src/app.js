const express = require('express');
const indexRouter = require('./routes/index.route')
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan('dev'));
app.use(indexRouter);
app.disable('x-powered-by');

module.exports = app;
