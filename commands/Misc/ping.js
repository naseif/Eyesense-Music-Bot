const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "ping",
  args: false,
  description: "Ping the bot connection to the server",
  usage: "ping",
  async run(message, args, client) {
    const embed = {
      title: "Ping Pong!",
      description: `📡 **Ping:** ${client.ws.ping}
      ⏱ **Latency:** ${Date.now() - message.createdTimestamp}ms.`,
      color: "#9dcc37",
    };

    return await message.channel.send({ embeds: [embed] });
  },
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping the bot connection to the server"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = {
      title: "Ping Pong!",
      description: `📡 **Ping:** ${client.ws.ping}
      ⏱ **Latency:** ${Date.now() - interaction.createdTimestamp}ms.`,
      color: "#9dcc37",
    };

    return await interaction.followUp({ embeds: [embed] });
  },
};
