const { prefix } = require("../config.json");

module.exports = {
  name: "messageCreate",
  async run(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    try {
      command.run(message, args, client, prefix);
    } catch (error) {
      client.logger(error.message, "error");
    }
  },
};
