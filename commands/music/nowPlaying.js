const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("shows the current music name"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `<@${interaction.user.id}>, ❌ | Nothing playing at the moment`
          ),
        ],
      });
    }

    await interaction.followUp({
      embeds: [
        embedMessage(
          "#9dcc37",
          `🎵 | **${queue.nowPlaying()}** in [<#${
            interaction.member.voice.channelId
          }>]`
        ),
      ],
    });
  },
};
