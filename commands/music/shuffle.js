const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("shuffles the music queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue)
      return await interaction.followUp({
        embeds: [
          await embedMessage("#9dcc37", `❌ | There is no queue to shuffle!`),
        ],
      });

    if (queue) {
      await queue.shuffle();
      await interaction.followUp({
        embeds: [
          await embedMessage(
            "#9dcc37",
            `✅ Queue has been shuffled [<@${interaction.user.id}>]`
          ),
        ],
      });
    }
  },
};
