const fetch = require("node-fetch");
/**
 *
 * @param {string} imageLink
 * @returns
 */

module.exports.getAnimeByImage = async (imageLink) => {
  try {
    const processImage = await fetch(
      `https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(
        imageLink
      )}`
    );
    const handleResponse = await processImage.json();
    return handleResponse;
  } catch (err) {
    throw err;
  }
};
