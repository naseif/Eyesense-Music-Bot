const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { getUserFromMention } = require("../../modules/getUserFromMention");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  name: "insult",
  args: true,
  description: "Insult your fav user <3",
  usage: "insult <user>",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("RED", `❌ Please mention your fav user to insult :)`),
        ],
      });

    const user = getUserFromMention(args[0], client);

    if (!user)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You sure you mentioned the user ?, because I could not resolve the given user`
          ),
        ],
      });

    try {
      const insult = await requestAPI(
        "https://evilinsult.com/generate_insult.php?lang=en&type=json"
      );

      await message.channel.send(
        `${user ? user : `${message.member.toString()}`}, ${insult.insult}`
      );
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send(
        `❌ Couldn't retrieve Insult, I blame <@503264757785165851>`
      );
    }
  },
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
        `❌ Couldn't retrieve Insult, I blame <@503264757785165851>`
      );
    }
  },
};
