const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const playdl = require("play-dl");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays music from Youtube, Spotify and Soundcloud!",
  args: true,
  usage: "p <YouTube URL | Song Name | Spotify URL | Soundcloud URL |>",
  async run(message, args, client, prefix) {
    const songString = args.join(" ");
    if (!songString)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | ${message.member.toString()}, You have to provide a song name or URL`
          ),
        ],
      });

    const checkdj = await client.db.get(`djRole_${message.guildId}`);
    const userRoles = await message.member.roles.cache.map((role) => role.id);

    if (
      checkdj &&
      !userRoles.includes(checkdj) &&
      message.guild.ownerId !== message.author.id
    ) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }
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

    let queue = await client.player.createQueue(message.guildId, {
      leaveOnEnd: false,
      leaveOnStop: true,
      initialVolume: 80,
      leaveOnEmptyCooldown: 60 * 1000 * 3,
      bufferingTimeout: 200,
      leaveOnEmpty: true,
      metadata: {
        channel: message.channel,
      },
      async onBeforeCreateStream(track, source, _queue) {
        if (source === "soundcloud") {
          const client_id = await playdl.getFreeClientID();
          playdl.setToken({
            soundcloud: {
              client_id: client_id,
            },
          });
          if (await playdl.so_validate(track.url)) {
            let soundCloudInfo = await playdl.soundcloud(track.url);
            return (await playdl.stream_from_info(soundCloudInfo)).stream;
          }
          return;
        }

        if (source === "youtube") {
          const validateSP = playdl.sp_validate(track.url);
          const spotifyList = ["track", "album", "playlist"];
          if (spotifyList.includes(validateSP)) {
            if (playdl.is_expired()) {
              await playdl.refreshToken();
            }
            let spotifyInfo = await playdl.spotify(track.url);
            let youtube = await playdl.search(`${spotifyInfo.name}`, {
              limit: 2,
            });
            return (await playdl.stream(youtube[0].url)).stream;
          }

          return (await playdl.stream(track.url)).stream;
        }
      },
    });

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
      client.player.deleteQueue(message.guildId);
      queue.destroy(true);
      return await message.channel.send({
        content: "Could not join your voice channel!",
      });
    }

    searchSong.playlist
      ? queue.addTracks(searchSong.tracks)
      : queue.addTrack(searchSong.tracks[0]);

    const musicEmbed = {
      color: "#9dcc37",
      title: `${queue.playing ? "✅ Added to Queue" : "🎵  Playing"}`,
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

    if (!queue.playing) {
      try {
        await queue.play();
        searchSong.playlist
          ? await message.channel.send({
              embeds: [playlistEmbed, musicEmbed],
            })
          : await message.channel.send({
              embeds: [musicEmbed],
            });
        return;
      } catch (err) {
        client.logger(err.message, "error");
        console.log(err);
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ | An error occurred while trying to play this song! \nError Message: ${err.message}`
            ),
          ],
        });
      }
    }

    if (queue.playing) {
      searchSong.playlist
        ? await message.channel.send({ embeds: [playlistEmbed, musicEmbed] })
        : await message.channel.send({ embeds: [musicEmbed] });
      return;
    }
  },
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays music from Youtube")
    .addStringOption((option) =>
      option.setName("song").setDescription("song name").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

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

    const checkdj = await client.db.get(`djRole_${interaction.guildId}`);
    const userRoles = await interaction.member.roles.cache.map(
      (role) => role.id
    );

    if (
      checkdj &&
      !userRoles.includes(checkdj) &&
      interaction.guild.ownerId !== interaction.member.id
    ) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    const songString = interaction.options.getString("song");
    const searchSong = await client.player.search(songString, {
      requestedBy: interaction.user,
    });

    if (!searchSong.tracks.length || !searchSong)
      return interaction.followUp({
        embeds: [embedMessage("#9dcc37", `❌ | Song not found`)],
      });

    let queue = await client.player.createQueue(interaction.guildId, {
      leaveOnEnd: false,
      leaveOnStop: true,
      initialVolume: 80,
      leaveOnEmptyCooldown: 60 * 1000 * 3,
      bufferingTimeout: 200,
      leaveOnEmpty: true,
      async onBeforeCreateStream(track, source, _queue) {
        if (source === "soundcloud") {
          const client_id = await playdl.getFreeClientID();
          playdl.setToken({
            soundcloud: {
              client_id: client_id,
            },
          });
          if (await playdl.so_validate(track.url)) {
            let soundCloudInfo = await playdl.soundcloud(track.url);
            return (await playdl.stream_from_info(soundCloudInfo)).stream;
          }
          return;
        }

        if (source === "youtube") {
          const validateSP = playdl.sp_validate(track.url);
          const spotifyList = ["track", "album", "playlist"];
          if (spotifyList.includes(validateSP)) {
            if (playdl.is_expired()) {
              await playdl.refreshToken();
            }
            let spotifyInfo = await playdl.spotify(track.url);
            let youtube = await playdl.search(`${spotifyInfo.name}`, {
              limit: 2,
            });
            return (await playdl.stream(youtube[0].url)).stream;
          }

          return (await playdl.stream(track.url)).stream;
        }
      },
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      client.player.deleteQueue(interaction.guildId);
      queue.destroy(true);
      return await interaction.followUp({
        content: "Could not join your voice channel!",
        empheral: true,
      });
    }

    searchSong.playlist
      ? queue.addTracks(searchSong.tracks)
      : queue.addTrack(searchSong.tracks[0]);

    const musicEmbed = {
      color: "#9dcc37",
      title: `${queue.playing ? "✅ Added to Queue" : "🎵  Playing"}`,
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

    if (!queue.playing) {
      try {
        await queue.play();
        searchSong.playlist
          ? await interaction.followUp({
              embeds: [playlistEmbed, musicEmbed],
            })
          : await interaction.followUp({
              embeds: [musicEmbed],
            });
        return;
      } catch (err) {
        client.logger(err.message, "error");
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ | An error occurred while trying to play this song! \nError Message: ${err.message}`
            ),
          ],
        });
      }
    }

    if (queue.playing) {
      searchSong.playlist
        ? await interaction.followUp({ embeds: [playlistEmbed, musicEmbed] })
        : await interaction.followUp({ embeds: [musicEmbed] });
      return;
    }
  },
};
