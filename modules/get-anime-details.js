const jikanjs = require("jikanjs");
const { logger } = require("./logger");
jikanjs.settings.setBaseURL("https://api.jikan.moe/v3", 3);

/**
 * Searches for an Anime on the Jikan Database
 * @param {String} animeName
 * @param {String} type
 * @returns Object
 */

module.exports.getAnimeInfo = async (animeName, type = "anime") => {
  try {
    const getId = await jikanjs.search(type, animeName, [1]);
    const animeId = getId.results[0].mal_id;
    if (!animeId) throw new Error("No anime ID was found!");
    const getFullInfo = await jikanjs.loadAnime(animeId, "/");
    const genresArray = getFullInfo.genres.map((element) => element.name);

    return {
      malid: getFullInfo.mal_id,
      imageUrl: getFullInfo.image_url,
      titlerom: getFullInfo.title,
      titleeng: getFullInfo.title_english,
      episodes: getFullInfo.episodes,
      status: getFullInfo.status,
      rating: getFullInfo.rating,
      score: getFullInfo.score,
      rank: getFullInfo.rank,
      synopsis: getFullInfo.synopsis,
      premiered: getFullInfo.premiered,
      genres: genresArray,
      aired: getFullInfo.aired.string,
    };
  } catch (err) {
    logger(err.message, "error");
    throw err;
  }
};
