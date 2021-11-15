const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const playdl = require("play-dl");

module.exports = {
  name: "playlist",
  aliases: ["pl"],
  description: "Plays a saved playlist or adds one",
  args: true,
  usage: "pl add <custom name > <playlist link> || pl name",
  async run(message, args, client, prefix) {
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
            "RED",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    let checkPlaylists = await client.db.all();
    const filterPlaylists = checkPlaylists
      .filter((playlist) => playlist.ID.startsWith(message.guildId))
      .map((playlist) => playlist.ID.slice(playlist.ID.indexOf("_") + 1));

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `Please specify whether you want to play or add a new custom playlist!\n Use \`${prefix}h pl\` for more info`
          ),
        ],
      });

    if (args[0] === "add" && !args[1] && !args[2])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `You have to provide the link of the playlist and a custom name! \n Use \`${prefix}h pl\` for more info`
          ),
        ],
      });

    if (args[0] === "add" && args[1] && args[2]) {
      if (!args[2].startsWith("https"))
        return await message.channel.send({
          embeds: [
            embedMessage("RED", ` ❌ This is not a valid playlist URL!`),
          ],
        });

      await client.db.set(`${message.guildId}_${args[1]}`, args[2]);
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | The playlist has been saved!\n Use ` +
              "`" +
              `${prefix}pl ${args[1]}` +
              "`" +
              ` to start playing it!`
          ),
        ],
      });
    }
    const customPlaylist = await client.db.get(`${message.guildId}_${args[0]}`);

    if (!customPlaylist)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `No Playlist found with this name!\n Available Playlists: \`${filterPlaylists.join(
              ", "
            )}\``
          ),
        ],
      });

    if (!message.member.voice.channelId)
      return message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You must be in a voice channel to play music!`
          ),
        ],
      });

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ | You must be in my voice channel!`)],
      });

    const searchSong = await client.player.search(customPlaylist, {
      requestedBy: message.member.user,
    });

    if (!searchSong.tracks.length || !searchSong)
      return message.channel.send({
        embeds: [
          embedMessage(
            "RED",
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
        channel: message,
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
              "RED",
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
    .setName("playlist")
    .setDescription("Plays a saved playlist or adds one")
    .addStringOption((option) =>
      option.setName("link").setDescription("playlist Link").setRequired(true)
    ),
  async execute(interaction, client) {},
};
