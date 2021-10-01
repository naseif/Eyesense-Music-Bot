const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { Lyrics } = require("@discord-player/extractor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("gets the lyrics of the current song")
    .addStringOption((option) =>
      option.setName("song").setDescription("song name")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const songString = interaction.options.getString("song");
    const lyricsClient = Lyrics.init();
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
