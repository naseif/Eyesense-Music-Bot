const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "deletemsgs",
  aliases: ["dm"],
  args: true,
  description: "Deletes x number of messages in a text channel",
  usage: "dm || deletemsgs <number>",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | Please provide the number of messages you want to delete!`
          ),
        ],
      });

    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You do not have permission to delete Messages!`
          ),
        ],
      });

    try {
      const getMessages = await message.channel.messages.fetch({
        limit: 100,
      });
      await message.channel.bulkDelete(Number(args[0]));
    } catch (error) {
      client.logger(error.message, "error");
      const errorEmbed = {
        color: "#9dcc37",
        description: `💥 ${error.message}`,
      };
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
  data: new SlashCommandBuilder()
    .setName("deletemessages")
    .setDescription("deletes x number of messages")
    .addIntegerOption((option) =>
      option.setName("int").setDescription("Enter an integer").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const integer = interaction.options.getInteger("int");

    if (
      !interaction.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES])
    )
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You do not have permission to delete Messages!`
          ),
        ],
      });

    try {
      const getMessages = await interaction.channel.messages.fetch({
        limit: 100,
      });
      await interaction.channel.bulkDelete(integer);
    } catch (error) {
      client.logger(error.message, "error");
      const errorEmbed = {
        color: "#9dcc37",
        description: `💥 ${error.message}`,
      };
      await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
