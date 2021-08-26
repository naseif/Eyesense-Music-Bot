const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("seeks the current song to the given position")
    .addStringOption((option) =>
      option
        .setName("num")
        .setDescription("Seek position number")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    const seekNumber = interaction.options.getString("num");
    await interaction.deferReply();

    if (!queue || !queue.playing)
      return await interaction.followUp(
        `❌ | There is nothing playing to seek!`
      );

    const embed = {
      color: "#9dcc37",
      description: `✅ **${queue.current.title}** has been seeked to ${seekNumber} [<@${interaction.user.id}>]`,
    };
    try {
      await queue.seek(Number(seekNumber));
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
