const Url = require('../model/url.model');
const redis = require('../config/redis');
const { createShortUrl } = require('../services/shortner.server');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    // If no custom alias, check if we already have a cached shortcode for this originalUrl
    if (!customAlias) {
      const redisKey = `shortUrl:orig:${originalUrl}`;
      const cachedCode = await redis.getCode(redisKey);
      if (cachedCode) {
        return res.json({
          shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${cachedCode}`,
          shortCode: cachedCode,
          originalUrl
        });
      }
    } else {
      // Validate custom alias format: alphanumeric, dashes, and underscores
      const aliasRegex = /^[a-zA-Z0-9_\-]+$/;
      if (!aliasRegex.test(customAlias)) {
        return res.status(400).json({ message: 'Custom alias must contain alphanumeric characters, dashes, or underscores only' });
      }

      // Check if custom alias already exists in DB
      const existing = await Url.findOne({ shortCode: customAlias });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias is already in use' });
      }
    }

    const userId = req.userId || null;
    const url = await createShortUrl(originalUrl, userId, customAlias);

    // Cache the redirection (code -> originalUrl)
    await redis.setCode(`shortUrl:${url.shortCode}`, url.originalUrl, 3600);

    // Cache the lookup (originalUrl -> code) if it's not a custom alias
    if (!customAlias) {
      await redis.setCode(`shortUrl:orig:${originalUrl}`, url.shortCode, 3600);
    }

    return res.status(201).json({
      message: 'URL shortened successfully',
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl
    });
  } catch (error) {
    console.error('Shorten Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    if (!req.params.code) {
      return res.status(400).send('Short code is required');
    }
    const { code } = req.params;

    const redisKey = `shortUrl:${code}`;
    // Check Redis
    const cachedUrl = await redis.get(redisKey);
    if (cachedUrl) {
      // Increment clicks in MongoDB
      await Url.updateOne({ shortCode: code }, { $inc: { clicks: 1 } });
      return res.redirect(cachedUrl);
    }

    // MongoDB lookup
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).send('URL not found');

    // Cache it
    await redis.set(redisKey, url.originalUrl, 3600);

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirection Error:', error);
    return res.status(500).send('Server error');
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const urls = await Url.find({ user: userId }).sort({ createdAt: -1 });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const avgClicks = totalUrls > 0 ? Number((totalClicks / totalUrls).toFixed(2)) : 0;

    return res.json({
      totalUrls,
      totalClicks,
      avgClicks,
      urls: urls.map(u => ({
        _id: u._id,
        originalUrl: u.originalUrl,
        shortCode: u.shortCode,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${u.shortCode}`,
        clicks: u.clicks,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const url = await Url.findOne({ shortCode: code });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Check ownership
    if (!url.user || url.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this URL' });
    }

    await Url.deleteOne({ _id: url._id });

    // Invalidate Redis cache
    await redis.del(`shortUrl:${code}`);
    await redis.del(`shortUrl:orig:${url.originalUrl}`);

    return res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Delete URL Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
