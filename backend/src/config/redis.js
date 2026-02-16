const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });
const expiry = 3600; // default 1 hour in seconds

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Connect once when the module is required. If connect fails we log the error
// but allow the app to continue (handlers already guard against null results).
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected');
    } catch (err) {
        console.error('Redis connect error:', err);
    }
})();

// Generic get wrapper
exports.get = async (key) => {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
};

// Generic set wrapper that accepts either an expiry number or options object
exports.set = async (key, value, opt) => {
    try {
        if (typeof opt === 'number') {
            await redisClient.set(key, value, { EX: opt });
        } else if (opt && typeof opt === 'object') {
            await redisClient.set(key, value, opt);
        } else if (expiry) {
            await redisClient.set(key, value, { EX: expiry });
        } else {
            await redisClient.set(key, value);
        }
    } catch (error) {
        console.error('Redis SET error:', error);
    }
};

// Backwards-compatible aliases used elsewhere in the repo
exports.getCode = exports.get;
exports.setCode = exports.set;