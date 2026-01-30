const Url = require('../model/url.model');
const { nanoid } = require('nanoid');

exports.createShortUrl = async (originalUrl) => {
  const shortCode = nanoid(7);

  const url = await Url.create({
    originalUrl,
    shortCode
  });

  return url;
};
