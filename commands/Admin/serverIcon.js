const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("chnages the server icon!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("the link of the new img, must end with png or jpg!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const newIcon = interaction.options.getString("link");

    if (
      !interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD]) ||
      !interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])
    )
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${interaction.user.toString()}, You do not have permission to change the server icon!`
          ),
        ],
      });

    try {
      await interaction.guild.setIcon(newIcon);
      await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `Server Icon has been successfully changed!`),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Could not change the server icon!, ${error.message}`
          ),
        ],
      });
    }
  },
};
