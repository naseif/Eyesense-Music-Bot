const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reverse")
    .setDescription("Reverse Audio Filter")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("ON/OFF")
        .setRequired(true)
        .addChoice("ON", "1")
        .addChoice("OFF", "0")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);
    const mode = interaction.options.getString("mode");

    if (!queue)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });

    switch (mode) {
      case "1":
        try {
          await queue.setFilters({
            reverse: true,
          });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been enabled`),
            ],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `Could not set the Filter`)],
          });
        }
        break;
      case "0":
        try {
          await queue.setFilters({ reverse: false });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been disabled`),
            ],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `Could not disable the filter`)],
          });
        }
    }
  },
};
