const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  name: "joke",
  args: false,
  usage: "joke <question>",
  description: "Gets a random joke!",
  async run(message, args, client) {
    try {
      const joke = await requestAPI(
        "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas"
      );

      const embed = {
        color: "#9dcc37",
        title: `Collection of Jokes`,
        description: `Dark Jokes ftw`,
        fields: [
          {
            name: "Joke",
            value: `${
              joke.type === "twopart"
                ? `${joke.setup}\n${joke.delivery}`
                : `${joke.joke}`
            }`,
          },
          {
            name: "Category",
            value: `${joke.category}`,
            inline: true,
          },
          {
            name: "Type",
            value: `${joke.type}`,
            inline: true,
          },
        ],
      };

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send(
        `Could not retrieve a Joke, I blame <@503264757785165851>`
      );
    }
  },
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("gets a random joke!"),
  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const joke = await requestAPI(
        "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas"
      );

      const embed = {
        color: "#9dcc37",
        title: `Collection of Jokes`,
        description: `Dark Jokes ftw`,
        fields: [
          {
            name: "Joke",
            value: `${
              joke.type === "twopart"
                ? `${joke.setup}\n${joke.delivery}`
                : `${joke.joke}`
            }`,
          },
          {
            name: "Category",
            value: `${joke.category}`,
            inline: true,
          },
          {
            name: "Type",
            value: `${joke.type}`,
            inline: true,
          },
        ],
      };

      await interaction.followUp({ embeds: [embed] });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp(
        `Could not retrieve a Joke, I blame <@503264757785165851>`
      );
    }
  },
};
