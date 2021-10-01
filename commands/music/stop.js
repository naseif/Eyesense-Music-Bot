const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the current song playing"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | <@${interaction.user.id}>, Nothing is playing to stop!`
          ),
        ],
      });
    }

    try {
      if (queue && queue.playing) {
        await queue.stop();
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Stopped **${queue.current.title}** in [<#${interaction.member.voice.channelId}>]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", `❌ | Something went wrong :/`)],
      });
    }
  },
};
