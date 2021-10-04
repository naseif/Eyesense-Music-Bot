const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init();

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  args: true,
  description: "Gets the lyrics of the current song or a song you pass",
  usage: "ly || lyrics <optional song name>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);
    const songString = args.join(" ");
    let songTitle;

    if (songString) {
      songTitle = songString;
    } else {
      if (!queue)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              "❌ There is no music playing to search for lyrics!"
            ),
          ],
        });
      if (queue.current.title) {
        songTitle = queue.current.title;

        const filterName = queue.current.title.indexOf("(");

        if (filterName !== -1) {
          songTitle = songTitle.slice(0, filterName);
        }
      }
    }

    try {
      const lyrics = await lyricsClient.search(songTitle);
      if (!lyrics)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ | I could not find any lyrics for this song!`
            ),
          ],
        });

      const lyricsEmbed = {
        color: "#9dcc37",
        title: `${lyrics.artist.name} - ${lyrics.title}`,
        author: {
          name: `${message.member.user.username}`,
          icon_url: `${message.member.user.avatarURL()}`,
        },
        description: `${lyrics.lyrics}`,
        thumbnail: {
          url: `${lyrics.thumbnail}`,
        },

        timestamp: new Date(),
      };

      await message.channel.send({
        embeds: [lyricsEmbed],
      });
    } catch (error) {
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | I could not get the lyrics of this song!`
          ),
        ],
      });
      client.logger(error.message, "error");
    }
  },
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Gets the lyrics of the current song or a song you pass")
    .addStringOption((option) =>
      option.setName("song").setDescription("song name")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const songString = interaction.options.getString("song");
    const queue = client.player.getQueue(interaction.guild);
    let songTitle;

    if (songString) {
      songTitle = songString;
    } else {
      if (!queue)
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              "❌ There is no music playing to search for lyrics!"
            ),
          ],
        });
      if (queue.current.title) {
        songTitle = queue.current.title;

        const filterName = queue.current.title.indexOf("(");

        if (filterName !== -1) {
          songTitle = songTitle.slice(0, filterName);
        }
      }
    }

    try {
      const lyrics = await lyricsClient.search(songTitle);
      if (!lyrics)
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ | I could not find any lyrics for this song!`
            ),
          ],
        });

      const lyricsEmbed = {
        color: "#9dcc37",
        title: `${lyrics.artist.name} - ${lyrics.title}`,
        author: {
          name: `${interaction.user.username}`,
          icon_url: `${interaction.user.avatarURL()}`,
        },
        description: `${lyrics.lyrics}`,
        thumbnail: {
          url: `${lyrics.thumbnail}`,
        },

        timestamp: new Date(),
      };

      await interaction.followUp({
        embeds: [lyricsEmbed],
      });
    } catch (error) {
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | I could not get the lyrics of this song!`
          ),
        ],
      });
      client.logger(error.message, "error");
    }
  },
};
