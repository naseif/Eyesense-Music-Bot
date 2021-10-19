const { embedMessage } = require("../../modules/embedSimple");
const { getAnimeInfo } = require("../../modules/get-anime-details");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { logger } = require("../../modules/logger");

module.exports = {
  name: "searchanime",
  args: true,
  aliases: ["san"],
  description: "Searches for an Anime on Myanimelist",
  usage: "san || searchanime",
  async run(message, args, client) {
    const searchString = args.join(" ");
    if (!searchString)
      return await message.channel.send({
        embeds: [embedMessage("#9dcc37", "You have to provide an anime name!")],
      });
    try {
      const Anime = await getAnimeInfo(searchString);
      const animeEmbed = {
        color: "#9dcc37",
        title: `${Anime.titlerom} AKA ${Anime.titleeng ?? `${Anime.titlerom}`}`,
        url: `${`https://myanimelist.net/anime/${Anime.malid}`}`,
        author: {
          name: `${message.member.user.username}`,
          icon_url: `${
            message.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
        description: `${Anime.synopsis}`,
        thumbnail: {
          url: `${Anime.imageUrl}`,
        },
        fields: [
          {
            name: "Status",
            value: `${Anime.status}`,
          },
          {
            name: "Rating",
            value: `${Anime.rating}`,
            inline: true,
          },
          {
            name: "Score/Rank",
            value: `${Anime.score}/${Anime.rank}`,
          },
          {
            name: "Premiered",
            value: Anime.premiered,
            inline: true,
          },
          {
            name: "Episodes Number",
            value: `${Anime.episodes ? Anime.episodes : "Unknown"}`,
            inline: true,
          },
          {
            name: "Aired",
            value: `${Anime.aired ? Anime.aired : "Unknown"}`,
            inline: true,
          },
          {
            name: "Genres",
            value: `${Anime.genres.join(" - ")}`,
            inline: true,
          },
        ],

        timestamp: new Date(),
      };

      await message.channel.send({ embeds: [animeEmbed] });
    } catch (err) {
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", `Could not find this Anime, Sry!`)],
      });
      logger(err.message, "error");
      console.error(err);
    }
  },
  data: new SlashCommandBuilder()
    .setName("searchanime")
    .setDescription("Searches for an Anime")
    .addStringOption((option) =>
      option
        .setName("anime")
        .setRequired(true)
        .setDescription("anime to search")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const animeName = interaction.options.getString("anime");

    try {
      const Anime = await getAnimeInfo(animeName);
      const animeEmbed = {
        color: "#9dcc37",
        title: `${Anime.titlerom} AKA ${Anime.titleeng ?? `${Anime.titlerom}`}`,
        url: `${`https://myanimelist.net/anime/${Anime.malid}`}`,
        author: {
          name: `${interaction.user.username}`,
          icon_url: `${
            interaction.user.avatarURL() || client.user.avatarURL()
          }`,
        },
        description: `${Anime.synopsis}`,
        thumbnail: {
          url: `${Anime.imageUrl}`,
        },
        fields: [
          {
            name: "Status",
            value: `${Anime.status}`,
          },
          {
            name: "Rating",
            value: `${Anime.rating}`,
            inline: true,
          },
          {
            name: "Score/Rank",
            value: `${Anime.score}/${Anime.rank}`,
          },
          {
            name: "Premiered",
            value: Anime.premiered,
            inline: true,
          },
          {
            name: "Episodes Number",
            value: `${Anime.episodes ? Anime.episodes : "Unknown"}`,
            inline: true,
          },
          {
            name: "Aired",
            value: `${Anime.aired ? Anime.aired : "Unknown"}`,
            inline: true,
          },
          {
            name: "Genres",
            value: `${Anime.genres.join(" - ")}`,
            inline: true,
          },
        ],

        timestamp: new Date(),
      };

      await interaction.followUp({ embeds: [animeEmbed] });
    } catch (err) {
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", `Could not find this Anime, Sry!`)],
      });
      logger(err.message, "error");
      console.error(err);
    }
  },
};
