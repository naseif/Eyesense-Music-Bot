const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { msToTime } = require("../../modules/mstoTime");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Since how long the bot is online"),
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        embedMessage(
          "#9dcc37",
          `${client.user.username}' Uptime: ${msToTime(client.uptime)}`
        ),
      ],
    });
  },
};
