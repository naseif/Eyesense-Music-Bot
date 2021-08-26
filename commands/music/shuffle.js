const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("shuffles the music queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue)
      return await interaction.followUp({
        content: `❌ | There is no queue to shuffle!`,
      });

    const embed = {
      color: "#9dcc37",
      description: `✅ Queue has been shuffled [<@${interaction.user.id}>]`,
    };

    if (queue) {
      await queue.shuffle();
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
