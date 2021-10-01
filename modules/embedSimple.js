/**
 * Simple function for embed messages
 * @param {string} color
 * @param {string} description
 * @returns Object Containing the new Embed
 */

module.exports.embedMessage = (color, description) => {
  const embed = {
    color: color,
    description: description,
  };

  return embed;
};
