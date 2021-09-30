const fetch = require("node-fetch");

/**
 *
 * @param {string} url
 * @returns
 */

module.exports.requestAPI = async (url) => {
  try {
    const request = await fetch(url);
    const responseToJson = await request.json();
    return responseToJson;
  } catch (err) {
    throw err;
  }
};
