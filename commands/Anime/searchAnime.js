const { embedMessage } = require("../../modules/embedSimple");
const { SlashCommandBuilder } = require("@discordjs/builders");

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
        embeds: [embedMessage("RED", "❌ You have to provide an anime name!")],
      });
    try {
      const Anime = await client.apis.getAnimeInfo(searchString);
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

      return await message.channel.send({ embeds: [animeEmbed] });
    } catch (err) {
      client.logger(err.message, "error");
      console.error(err);
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ Could not find this Anime, Sry!`)],
      });
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
      const Anime = await client.apis.getAnimeInfo(animeName);
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

      return await interaction.followUp({ embeds: [animeEmbed] });
    } catch (err) {
      await interaction.followUp({
        embeds: [embedMessage("RED", `❌ Could not find this Anime, Sry!`)],
      });
      client.logger(err.message, "error");
      console.error(err);
    }
  },
};
