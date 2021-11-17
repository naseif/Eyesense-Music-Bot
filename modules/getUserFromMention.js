/**
 * Parses User Mention
 * @param {User} mention
 * @param {Client} client
 * @returns User Class
 */

module.exports.getUserFromMention = (mention, client) => {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }
};

/**
 * ´Gets the GuildMember Object
 * @param {mention} mention
 * @param {message} message
 * @returns GuildMember Object
 */
module.exports.getGuildUserFromMention = (mention, message) => {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return message.guild.members.cache.get(mention);
  }
};
/**
 * Gets the Role Object
 * @param {mention} mention
 * @param {message} message
 * @returns Role Object
 */

module.exports.getRoleFromMention = async (mention, message) => {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("&")) {
      mention = mention.slice(1);
    }

    return await message.guild.roles.fetch(mention);
  }
};

/**
 * Parses the Text Channel ID
 * @param {TextChannel} mention
 * @param {Message} message
 * @returns ID String
 */
module.exports.getTextChannelFromMention = (mention) => {
  if (!mention) return;

  if (mention.startsWith("<#") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    return mention;
  } else {
    return;
  }
};
