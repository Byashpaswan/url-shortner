const router = require('express').Router();
const rateLimiter = require('../../middleware/ratelimiter');
const controller = require('../../controller/url.controller');

router.post('/shorten', rateLimiter, controller.shortenUrl);
router.get('/:code', controller.redirectUrl);

module.exports = router;
