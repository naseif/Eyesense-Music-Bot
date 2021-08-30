const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("insult your fav user <3")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    await interaction.deferReply();

    async function getInsult() {
      try {
        const requestInsult = await fetch(
          "https://evilinsult.com/generate_insult.php?lang=en&type=json"
        );
        const responseToJson = await requestInsult.json();
        return responseToJson;
      } catch (err) {
        throw err;
      }
    }

    try {
      const insult = await getInsult();

      await interaction.followUp(`${user}, ${insult.insult}`);
    } catch (error) {
      await interaction.followUp(
        `Couldn't retrieve Insult, I blame <@503264757785165851>`
      );
    }
  },
};
