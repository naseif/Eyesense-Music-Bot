const fetch = require("node-fetch");
const { TMDb } = require("../config.json");

/**
 *  Searches for the Movie and returns its ID
 * @param {String} searchParam
 * @param {String} year
 * @returns Movie ID
 */
module.exports.getMovieID = async (searchParam, year) => {
  try {
    const apiCall = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDb}&language=en-US&query=${searchParam}&page=1&include_adult=false&year=${year}`
    );
    const convertResponeToJson = await apiCall.json();
    if (!convertResponeToJson.total_results)
      throw new Error(`${"Nothing found with this name!"}`);

    return convertResponeToJson.results[0].id;
  } catch (err) {
    throw err;
  }
};

/**
 * Gets Info about Movies based on an ID
 * @param {String} id
 * @returns Returns an Object containing all Info about the Movie
 */
module.exports.getDetails = async (id) => {
  try {
    const apiCall = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDb}&language=en-US`
    );
    const convertRes = await apiCall.json();
    return convertRes;
  } catch (err) {
    throw err;
  }
};
