const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "nowplaying",
  aliases: ["now"],
  args: false,
  description: "Shows the current song playing",
  usage: "now || nowplaying",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${message.member.toString()}, ❌ | Nothing playing at the moment`
          ),
        ],
      });
    }

    return await message.channel.send({
      embeds: [
        embedMessage(
          "#9dcc37",
          `🎵 | **${queue.nowPlaying()}** in [<#${
            message.member.voice.channelId
          }>]`
        ),
      ],
    });
  },
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows the current song playing"),

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
