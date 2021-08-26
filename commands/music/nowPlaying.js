const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("playingnow")
    .setDescription("shows the current music name"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        content: `<@${interaction.user.id}>, ❌ | Nothing playing at the moment`,
      });
    }
    await interaction.followUp(` 🎵 | Playing now **${queue.nowPlaying()}**`);
  },
};
