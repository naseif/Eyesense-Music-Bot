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
            "RED",
            `${message.member.toString()}, ❌ | Nothing playing at the moment`
          ),
        ],
      });
    }
    const trackProgress = queue.createProgressBar({
      timecodes: true,
      length: 8,
    });

    const embed = {
      description: `🎵 | **${queue.nowPlaying()}**`,
      thumbnail: {
        url: `${queue.current.thumbnail}`,
      },
      fields: [
        {
          name: "\u200b",
          value: trackProgress.replace(/ 0:00/g, " ◉ LIVE"),
        },
      ],
      color: "#9dcc37",
      timestamp: new Date(),
    };

    return await message.channel.send({
      embeds: [embed],
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
            "RED",
            `<@${interaction.user.id}>, ❌ | Nothing playing at the moment`
          ),
        ],
      });
    }

    const trackProgress = queue.createProgressBar({
      timecodes: true,
      length: 8,
    });

    const embed = {
      description: `🎵 | **${queue.nowPlaying()}**`,
      thumbnail: {
        url: `${queue.current.thumbnail}`,
      },
      fields: [
        {
          name: "\u200b",
          value: trackProgress.replace(/ 0:00/g, " ◉ LIVE"),
        },
      ],
      color: "#9dcc37",
      timestamp: new Date(),
    };

    return await interaction.followUp({
      embeds: [embed],
    });
  },
};
