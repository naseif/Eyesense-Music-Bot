const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { requestAPI } = require("../../modules/requestAPI");
const { GiphyKey } = require("../../config.json");

module.exports = {
  name: "gif",
  args: true,
  description: "Gets a random gif or based on your search query",
  usage: "gif || gif <search (optional)> ",
  async run(message, args, client) {
    const query = args.join(" ");

    if (!GiphyKey)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ Your Giphy API Key is not defined in config.json!`
          ),
        ],
      });

    if (!query) {
      const random = await requestAPI(
        `https://api.giphy.com/v1/gifs/random?api_key=${GiphyKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const randomEmbed = {
        color: "#9dcc37",
        image: {
          url: `${random.data.images.original.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${
            message.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
      };

      return await message.channel.send({ embeds: [randomEmbed] });
    }

    try {
      const request = await requestAPI(
        `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${GiphyKey}&limit=25`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!request.data.length)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "RED",
              `❌ Could not find any gifs for your search query!`
            ),
          ],
        });

      const randomGif =
        request.data[Math.floor(Math.random() * request.data.length)];

      const gifEmbed = {
        color: "#9dcc37",
        image: {
          url: `${randomGif?.images.original.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${
            message.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
      };

      return await message.channel.send({ embeds: [gifEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send({
        embeds: [embedMessage("RED", `❌ Could not retrieve the gif!`)],
      });
      console.error(error);
    }
  },
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Gets a random gif or based on your search query")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("search for a gif")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const query = interaction.options.getString("search");

    if (!GiphyKey)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ Your Giphy API Key is not defined in config.json!`
          ),
        ],
      });
    if (!query) {
      const random = await requestAPI(
        `https://api.giphy.com/v1/gifs/random?api_key=${GiphyKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const randomEmbed = {
        color: "#9dcc37",
        image: {
          url: `${random.data.images.original.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${interaction.member.user.username}`,
          icon_url: `${
            interaction.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
      };

      return await interaction.followUp({ embeds: [randomEmbed] });
    }

    const request = await requestAPI(
      `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${GiphyKey}&limit=25`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request.data)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ Could not find any Gif for your search query!`
          ),
        ],
      });

    const randomGif =
      request.data[Math.floor(Math.random() * request.data.length)];

    const gifEmbed = {
      color: "#9dcc37",
      image: {
        url: `${randomGif.images.original.url}`,
      },
      timestamp: new Date(),
      footer: {
        text: `Requested by ${interaction.member.user.username}`,
        icon_url: `${
          interaction.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
    };

    return await interaction.followUp({ embeds: [gifEmbed] });
  },
};
