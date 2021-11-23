const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const playdl = require("play-dl");
const { Music } = require("../../modules/Music.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "playlist",
  aliases: ["pl"],
  description: "Plays a saved playlist or adds one",
  args: true,
  usage: "pl add <custom name > <playlist link> || pl name",
  async run(message, args, client, prefix) {
    const user = message.member.user;
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

    if (args[0] === "remove" && !args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `Please provide the name of the playlist you want to remove!\n Available Playlists: \`${
              filterPlaylists ? filterPlaylists.join(" - ") : "None"
            }\``
          ),
        ],
      });

    if (args[0] === "remove" && args[1]) {
      const playlistToRemove = await client.db.get(
        `${message.guildId}_${args[1]}`
      );

      if (!playlistToRemove)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "RED",
              `There is no playlist with this name in my Database!`
            ),
          ],
        });

      await client.db.delete(`${message.guildId}_${args[1]}`);
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | Playlist with alias \`${args[1]}\` has been removed`
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
            `No Playlist found with this name!\n Available Playlists: \`${
              filterPlaylists ? filterPlaylists.join(" - ") : "None"
            }\``
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

    await new Music().play(customPlaylist, message, client, user);
  },
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Plays a saved playlist or adds one")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("ADD/PLAY")
        .setRequired(true)
        .addChoice("Add", "add")
        .addChoice("Play", "play")
        .addChoice("Remove", "remove")
    )
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription(
          "Provide the name of the saved playlist or an alias and a link <alias> <playlist link> to add one!"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const action = interaction.options.getString("action");
    const playlist = interaction.options.getString("playlist");

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
            "RED",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    let checkPlaylists = await client.db.all();
    const filterPlaylists = checkPlaylists
      .filter((playlist) => playlist.ID.startsWith(interaction.guildId))
      .map((playlist) => playlist.ID.slice(playlist.ID.indexOf("_") + 1));

    switch (action) {
      case "add":
        const spiltPlyList = playlist.split(" ");
        if (!spiltPlyList[1].startsWith("https"))
          return await interaction.followUp({
            embeds: [
              embedMessage("RED", ` ❌ This is not a valid playlist URL!`),
            ],
          });

        await client.db.set(
          `${interaction.guildId}_${spiltPlyList[0]}`,
          spiltPlyList[1]
        );
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | The playlist has been saved!\n Use ` +
                "`" +
                `/playlist ${spiltPlyList[0]}` +
                "`" +
                ` to start playing it!`
            ),
          ],
        });
        break;
      case "play":
        const customPlaylist = await client.db.get(
          `${interaction.guildId}_${playlist}`
        );

        if (!customPlaylist)
          return await interaction.followUp({
            embeds: [
              embedMessage(
                "RED",
                `No Playlist found with this name!\n Available Playlists: \`${
                  filterPlaylists ? filterPlaylists.join(" - ") : "None"
                }\``
              ),
            ],
          });

        if (!interaction.member.voice.channelId)
          return interaction.followUp({
            embeds: [
              embedMessage(
                "RED",
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
              embedMessage("RED", `❌ | You must be in my voice channel!`),
            ],
          });

        const searchSong = await client.player.search(customPlaylist, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        });

        if (!searchSong.tracks.length || !searchSong)
          return interaction.followUp({
            embeds: [embedMessage("RED", `❌ | Song not found`)],
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
            icon_url: `${
              interaction.user.avatarURL() || client.user.avatarURL()
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
                  "RED",
                  `❌ | An error occurred while trying to play this song! \nError Message: ${err.message}`
                ),
              ],
            });
          }
        }

        if (queue.playing) {
          searchSong.playlist
            ? await interaction.followUp({
                embeds: [playlistEmbed, musicEmbed],
              })
            : await interaction.followUp({ embeds: [musicEmbed] });
          return;
        }
        break;

      case "remove":
        const playlistToRemove = await client.db.get(
          `${interaction.guildId}_${playlist}`
        );

        if (!playlistToRemove)
          return await interaction.followUp({
            embeds: [
              embedMessage(
                "RED",
                `There is no playlist with this name in my Database!`
              ),
            ],
          });

        await client.db.delete(`${interaction.guildId}_${playlist}`);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Playlist with alias \`${playlist}\` has been removed`
            ),
          ],
        });
        break;
    }
  },
};
