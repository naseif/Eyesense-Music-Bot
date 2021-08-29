const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("disconnects from the channel"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ I am not connected to a voice channel!`),
        ],
      });
    }

    try {
      if (queue) {
        await queue.destroy(true);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${interaction.client.user.username}** disconnected from [<#${interaction.member.voice.channelId}>]`
            ),
          ],
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
};
