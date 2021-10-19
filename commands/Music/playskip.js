const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "playskip",
  aliases: ["ps"],
  description: "Skips the current song and plays the new song",
  args: true,
  usage: "ps <YouTube URL | Song Name | Spotify URL | Soundcloud URL |>",
  async run(message, args, client, prefix) {
    const songString = args.join(" ");
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Nothing is playing to skip and play! Please use ${prefix}play instead`
          ),
        ],
      });

    if (!songString)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | ${message.member.toString()}, You have to provide a song name or URL`
          ),
        ],
      });

    if (!message.member.voice.channelId)
      return message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You must be in a voice channel to play music!`
          ),
        ],
      });

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ | You must be in my voice channel!`),
        ],
      });

    const searchSong = await client.player.search(songString, {
      requestedBy: message.member.user,
    });

    if (!searchSong.tracks.length || !searchSong)
      return message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Song not found, Maybe its age restricted or flagged as offensive by Youtube`
          ),
        ],
      });

    const musicEmbed = {
      color: "#9dcc37",
      title: `🎵  Playing`,
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
      description: `Song: **[${searchSong.tracks[0].title}](${searchSong.tracks[0].url})**`,
      thumbnail: {
        url: `${searchSong.tracks[0].thumbnail}`,
      },
      fields: [
        {
          name: "Author",
          value: `${searchSong.tracks[0].author}`,
          inline: true,
        },
        {
          name: "🕓 Duration",
          value: `${searchSong.tracks[0].duration}`,
          inline: true,
        },
      ],

      timestamp: new Date(),
    };

    let playlistEmbed = {
      color: "#9dcc37",
      description: `✅ | Queued ${queue.tracks.length} Songs`,
    };

    if (queue.playing) {
      await queue.clear();
      await queue.skip();
      searchSong.playlist
        ? queue.addTracks(searchSong.tracks)
        : queue.addTrack(searchSong.tracks[0]);
      searchSong.playlist
        ? await message.channel.send({ embeds: [playlistEmbed, musicEmbed] })
        : await message.channel.send({ embeds: [musicEmbed] });
      return;
    }
  },
  data: new SlashCommandBuilder()
    .setName("playskip")
    .setDescription("Skips the current song and plays the new song")
    .addStringOption((option) =>
      option.setName("song").setDescription("song name").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Nothing is playing to skip and play! Please use /play instead`
          ),
        ],
      });

    if (!interaction.member.voice.channelId)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You must be in a voice channel to play music!`
          ),
        ],
      });

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ | You must be in my voice channel!`),
        ],
      });

    const songString = interaction.options.getString("song");
    const searchSong = await client.player.search(songString, {
      requestedBy: interaction.user,
    });

    if (!searchSong.tracks.length || !searchSong)
      return interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Song not found, Maybe its age restricted or flagged as offensive by Youtube`
          ),
        ],
      });

    const musicEmbed = {
      color: "#9dcc37",
      title: `🎵  Playing`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL() || client.user.avatarURL()}`,
      },
      description: `Song: **[${searchSong.tracks[0].title}](${searchSong.tracks[0].url})**`,
      thumbnail: {
        url: `${searchSong.tracks[0].thumbnail}`,
      },
      fields: [
        {
          name: "Author",
          value: `${searchSong.tracks[0].author}`,
          inline: true,
        },
        {
          name: "🕓 Duration",
          value: `${searchSong.tracks[0].duration}`,
          inline: true,
        },
      ],

      timestamp: new Date(),
    };

    let playlistEmbed = {
      color: "#9dcc37",
      description: `✅ | Queued ${queue.tracks.length} Songs`,
    };

    if (queue.playing) {
      await queue.clear();
      await queue.skip();
      searchSong.playlist
        ? queue.addTracks(searchSong.tracks)
        : queue.addTrack(searchSong.tracks[0]);
      searchSong.playlist
        ? await interaction.followUp({ embeds: [playlistEmbed, musicEmbed] })
        : await interaction.followUp({ embeds: [musicEmbed] });
      return;
    }
  },
};
