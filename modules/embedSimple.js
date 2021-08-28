function embedMessage(color, description) {
  const embed = {
    color: color,
    description: description,
  };

  return embed;
}

module.exports = { embedMessage };
