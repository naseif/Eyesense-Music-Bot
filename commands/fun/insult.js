const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("insult your fav user <3")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");

    try {
      const insult = await requestAPI(
        "https://evilinsult.com/generate_insult.php?lang=en&type=json"
      );

      await interaction.followUp(
        `${user ? user : `${interaction.member.toString()}`}, ${insult.insult}`
      );
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp(
        `Couldn't retrieve Insult, I blame <@503264757785165851>`
      );
    }
  },
};
