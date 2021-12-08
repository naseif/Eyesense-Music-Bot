const { SlashCommandBuilder } = require("@discordjs/builders");
const { TMDb } = require("../../config.json");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "searchmovie",
  aliases: ["sm"],
  args: true,
  description: "Searches for Movies on TMDB",
  usage: "sm || searchmovie <movie name>",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [embedMessage("#9dcc37", `You did not provide a Movie name`)],
      });

    if (!TMDb)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You did not add your TMDB API token in the config file!`
          ),
        ],
      });

    let searchString = [];
    searchString[0] = "";
    args.forEach((arg) => {
      if (Number(arg)) {
        searchString[1] = arg;
      } else {
        if (searchString[0].length === 0) {
          searchString[0] += arg;
        } else {
          searchString[0] += " " + arg;
        }
      }
    });

    if (!searchString[0])
      return await message.channel.send({
        embeds: [embedMessage("#9dcc37", `You have to provide a Movie name!`)],
      });
    try {
      let movie = await client.api.getMovieDetails(searchString[0], TMDb);
      // if (searchString[1]) {
      //   const movieWithYear = await getMovieID(
      //     searchString[0],
      //     searchString[1]
      //   );
      //   movie = await getDetails(movieWithYear);
      // } else {
      //   const withoutYear = await getMovieID(searchString[0]);
      //   movie = await getDetails(withoutYear);
      // }

      const movieEmbed = {
        color: "#9dcc37",
        title: `${movie.title} (${movie.release_date.slice(0, 4)})`,
        url: `${`https://www.themoviedb.org/movie/${movie.id}`}`,
        author: {
          name: `${message.member.user.username}`,
          icon_url: `${
            message.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
        description: `${movie.overview}`,
        thumbnail: {
          url: `https://image.tmdb.org/t/p/h60${
            movie.production_companies[0]?.logo_path
              ? movie.production_companies[0].logo_path
              : "https://i.imgur.com/0W3T391.png"
          }`,
        },
        fields: [
          {
            name: "Genres",
            value: `${movie.genres.map((genre) => genre.name).join("-")}`,
          },
          {
            name: "Rating",
            value: `${
              movie.vote_average ? movie.vote_average : "Not aired yet!"
            }`,
            inline: true,
          },
          {
            name: "Runtime",
            value: `${movie.runtime}`,
          },
          {
            name: "Year",
            value: `${
              movie?.release_date.slice(0, 4)
                ? movie.release_date.slice(0, 4)
                : "Not Released Yet"
            }`,
            inline: true,
          },
          {
            name: "Language",
            value: `${movie.spoken_languages
              .map((lang) => lang.english_name)
              .join(", ")}`,
            inline: true,
          },
          {
            name: "Tagline",
            value: `${movie?.tagline ? movie.tagline : "Ups, no Tagline :("}`,
            inline: true,
          },
        ],
        image: {
          url: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
        },
        timestamp: new Date(),
      };

      return await message.channel.send({ embeds: [movieEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      console.error(error);
    }
  },
  data: new SlashCommandBuilder()
    .setName("searchmovie")
    .setDescription("Searches for Movies on TMDB")
    .addStringOption((option) =>
      option.setName("movie").setDescription("Movie").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const movieName = interaction.options.getString("movie");

    if (!TMDb)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You did not add your TMDB API token in the config file!`
          ),
        ],
      });

    try {
      const movie = await client.apis.getMovieDetails(movieName, TMDb);

      const movieEmbed = {
        color: "#9dcc37",
        title: `${movie.title} (${movie.release_date.slice(0, 4)})`,
        url: `${`https://www.themoviedb.org/movie/${movie.id}`}`,
        author: {
          name: `${interaction.user.username}`,
          icon_url: `${
            interaction.user.avatarURL() || client.user.avatarURL()
          }`,
        },
        description: `${movie.overview}`,
        thumbnail: {
          url: `https://image.tmdb.org/t/p/h60${
            movie.production_companies[0]?.logo_path
              ? movie.production_companies[0].logo_path
              : "https://i.imgur.com/0W3T391.png"
          }`,
        },
        fields: [
          {
            name: "Genres",
            value: `${movie.genres.map((genre) => genre.name).join("-")}`,
          },
          {
            name: "Rating",
            value: `${
              movie.vote_average ? movie.vote_average : "Not aired yet!"
            }`,
            inline: true,
          },
          {
            name: "Runtime",
            value: `${movie.runtime}`,
          },
          {
            name: "Year",
            value: `${
              movie?.release_date.slice(0, 4)
                ? movie.release_date.slice(0, 4)
                : "Not Released Yet"
            }`,
            inline: true,
          },
          {
            name: "Language",
            value: `${movie.spoken_languages
              .map((lang) => lang.english_name)
              .join(", ")}`,
            inline: true,
          },
          {
            name: "Tagline",
            value: `${movie?.tagline ? movie.tagline : "Ups, no Tagline :("}`,
            inline: true,
          },
        ],
        image: {
          url: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
        },
        timestamp: new Date(),
      };

      return await interaction.followUp({ embeds: [movieEmbed] });
    } catch (error) {
      logger(error.message, "error");
      console.error(error);
    }
  },
};
