const fetch = require("node-fetch");

/**
 * Performs a simple GET request
 * @param {string} url
 * @returns Response from the API as JSON
 */

module.exports.requestAPI = async (url, options = {}) => {
  try {
    const request = await fetch(url, options);
    const responseToJson = await request.json();
    return responseToJson;
  } catch (err) {
    throw err;
  }
};
