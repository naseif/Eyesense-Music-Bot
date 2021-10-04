const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the current queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ | Nothing to list, Queue is empty`),
        ],
      });
    }

    const tracks = queue?.tracks?.map(
      (track) => `<@${track.requestedBy.id}>, ${track.title}`
    );
    const queueEmbed = {
      color: "#9dcc37",
      title: `Current Queue`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
      description: `${tracks.join("\n")}`,
      timestamp: new Date(),
    };

    await interaction.followUp({ embeds: [queueEmbed] });
  },
};
