module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
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
      embed.setDescription(
        "There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately."
      );
      return message.channel.send({ embeds: [embed] });
    }
  },
};
