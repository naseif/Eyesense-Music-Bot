const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
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

    await interaction.followUp({ embeds: [embed] });
  },
};
