const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clears the music queue"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          await embedMessage(
            "#9dcc37",
            `❌ | No Queue has been created for this guild. <Queue is empty>`
          ),
        ],
      });
    }

    if (queue) {
      await queue.clear();
      await interaction.followUp({
        embeds: [
          await embedMessage(
            "#9dcc37",
            `✅ Queue Cleared! [<@${interaction.user.id}>]`
          ),
        ],
      });
    }
  },
};
