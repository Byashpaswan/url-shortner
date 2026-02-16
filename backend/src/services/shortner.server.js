const Url = require('../model/url.model');

exports.createShortUrl = async (originalUrl) => {
  // `nanoid` is an ES module in recent versions; import dynamically to support CommonJS
  const { nanoid } = await import('nanoid');
  const shortCode = nanoid(7);

  const url = await Url.create({
    originalUrl,
    shortCode
  });

  return url;
};
