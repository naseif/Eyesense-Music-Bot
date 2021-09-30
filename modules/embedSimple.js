/**
 *
 * @param {string} color
 * @param {string} description
 * @returns
 */

module.exports.embedMessage = (color, description) => {
  const embed = {
    color: color,
    description: description,
  };

  return embed;
};
