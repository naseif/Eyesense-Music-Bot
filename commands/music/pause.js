const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("pauses the song"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing)
      return await interaction.followUp(
        `❌ | There is nothing playing to pause!`
      );
    const embed = {
      color: "#9dcc37",
      description: `✅ **${queue.current.title}** paused [<@${interaction.user.id}>]`,
    };
    if (queue) {
      await queue.setPaused(true);
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
