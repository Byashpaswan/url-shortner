const indexRouter = require('express').Router();
const urlRoute = require('./url/url.route');
const authRoute = require('./auth/auth.route');

indexRouter.use('/url', urlRoute);
indexRouter.use('/auth', authRoute);

module.exports = indexRouter;