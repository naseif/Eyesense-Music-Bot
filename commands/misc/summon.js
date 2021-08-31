const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("summon")
    .setDescription("ping the bot connection to the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to summon!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    if (!interaction.member.permissions.has([Permissions.FLAGS.MOVE_MEMBERS]))
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You have no permission to summon users!`
          ),
        ],
      });

    if (!user.voice.channelId)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${user.toString()} is not connected to any voice channel!`
          ),
        ],
      });

    try {
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `User ${user.toString()} has been moved to <#${
              interaction.member.voice.channelId
            }>`
          ),
        ],
      });
      await user.voice.setChannel(interaction.member.voice.channelId);
    } catch (err) {
      return await interaction.followUp(
        `Something went wrong, I could not summon this user!`
      );
    }
  },
};
