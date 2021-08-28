const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("plays previous track from the queue"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            `#9dcc37`,
            `❌ | No Queue has been created for this guild. <Queue is empty>`
          ),
        ],
      });
    }

    if (Array.isArray(queue.tracks) && queue.tracks.length < 1) {
      return await interaction.followUp(
        `❌ | Your Queue is empty since you skipped all the tracks`
      );
    }

    await queue.back();
    await interaction.followUp({
      embeds: [
        embedMessage(
          "#9dcc37",
          `Playing Previous Track **${queue.previousTracks[0].title}**, [<@${interaction.user.id}>]`
        ),
      ],
    });
  },
};
