const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("gets a random joke!"),
  async execute(interaction, client) {
    await interaction.deferReply();
    async function getJoke() {
      try {
        const requestInsult = await fetch(
          "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas"
        );
        const responseToJson = await requestInsult.json();
        return responseToJson;
      } catch (err) {
        throw err;
      }
    }

    try {
      const joke = await getJoke();

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
      await interaction.followUp(
        `Could not retrieve a Joke, I blame <@503264757785165851>`
      );
    }
  },
};
