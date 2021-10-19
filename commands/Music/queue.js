const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "queue",
  aliases: ["q"],
  args: false,
  description: "Shows all queued songs",
  usage: "q || queue",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return await message.channel.send({
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
      title: `Queue contains ${queue?.tracks.length} songs!`,
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
      description: `${tracks.join("\n")}`,
      footer: {
        text: `Playing Now: ${
          queue?.nowPlaying() ? queue?.nowPlaying() : "Nothing"
        }`,
      },
    };

    await message.channel.send({ embeds: [queueEmbed] });
  },
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows all queued songs"),

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
      title: `Queue contains ${queue?.tracks.length} songs!`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL() || client.user.avatarURL()}`,
      },
      description: `${tracks.join("\n")}`,
      footer: {
        text: `Playing Now: ${queue?.nowPlaying() || "Nothing"}`,
      },
    };

    await interaction.followUp({ embeds: [queueEmbed] });
  },
};
