const Url = require('../model/url.model');

exports.createShortUrl = async (originalUrl, userId = null, customCode = null) => {
  let shortCode = customCode;
  if (!shortCode) {
    // `nanoid` is an ES module in recent versions; import dynamically to support CommonJS
    const { nanoid } = await import('nanoid');
    shortCode = nanoid(7);
  }

  const url = await Url.create({
    originalUrl,
    shortCode,
    user: userId
  });

  return url;
};
