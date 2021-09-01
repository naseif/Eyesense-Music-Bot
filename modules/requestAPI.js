const fetch = require("node-fetch");

module.exports.requestAPI = async (url) => {
  try {
    const request = await fetch(url);
    const responseToJson = await request.json();
    return responseToJson;
  } catch (err) {
    throw err;
  }
};
