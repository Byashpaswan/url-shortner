const router = require('express').Router();
const rateLimiter = require('../../middleware/ratelimiter');
const auth = require('../../middleware/auth');
const controller = require('../../controller/url.controller');

// Shorten URL (requires authentication)
router.post('/shorten', auth, rateLimiter, controller.shortenUrl);

// Get analytics for user (requires authentication)
router.get('/analytics', auth, controller.getAnalytics);

// Delete shortened URL (requires authentication)
router.delete('/:code', auth, controller.deleteUrl);

// Redirect URL (public)
router.get('/:code', controller.redirectUrl);

module.exports = router;
