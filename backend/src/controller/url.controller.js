const Url = require('../model/url.model');
const redis = require('../config/redis');
const { createShortUrl } = require('../services/shortner.server');

exports.shortenUrl = async (req, res) => {
  try {
    if (!req.body.originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }
    const { originalUrl } = req.body;

    const url = await createShortUrl(originalUrl);

  return res.json({
    shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
  });
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {

  try {
    if (!req.params.code) {
      return res.status(400).send('Short code is required');
    }
    const { code } = req.params;

  //  Check Redis
  const cachedUrl = await redis.get(code);
  if (cachedUrl) {
    await Url.updateOne({ shortCode: code }, { $inc: { clicks: 1 } });
    return res.redirect(cachedUrl);
  }

  //  MongoDB
  const url = await Url.findOne({ shortCode: code });
  if (!url) return res.status(404).send('URL not found');

  //  Cache it
  await redis.set(code, url.originalUrl, { EX: 3600 });

  url.clicks++;
  await url.save();

  res.redirect(url.originalUrl);
} catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  } 
};  
