const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resumes the song"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ | There is nothing playing to resume!`),
        ],
      });

    try {
      if (queue) {
        await queue.setPaused(false);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${queue.current.title}** resumed [<@${interaction.user.id}>]`
            ),
          ],
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
};
