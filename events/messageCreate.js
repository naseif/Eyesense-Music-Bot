const { prefix } = require("../config.json");

module.exports = {
  name: "messageCreate",
  async run(message, client) {
    if (!message.guild) return;

    let defaultPrefix;
    let mongoPrefix = await client.db.get(`guild_prefix_${message.guildId}`);

    mongoPrefix ? (defaultPrefix = mongoPrefix) : (defaultPrefix = prefix);

    if (!message.content.startsWith(defaultPrefix) || message.author.bot)
      return;

    const args = message.content.slice(defaultPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    try {
      command.run(message, args, client, defaultPrefix);
    } catch (error) {
      client.logger(error.message, "error");
    }
  },
};
