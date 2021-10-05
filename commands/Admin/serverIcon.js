const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "servericon",
  args: true,
  aliases: ["si"],
  description: "Changes the server icon!",
  usage: "si || servericon <link must end with png or jpg>",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ | Please provide a link to the new img!`),
        ],
      });

    if (
      !message.member.permissions.has("MANAGE_GUILD") ||
      !message.member.permissions.has("ADMINISTRATOR")
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | ${interaction.user.toString()}, You do not have permission to change the server icon!`
          ),
        ],
      });

    try {
      await message.guild.setIcon(args[0]);
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | Server Icon has been successfully changed!`
          ),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Could not change the server icon!, ${error.message}`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Changes the server icon!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("the link of the new img, must end with png or jpg!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const newIcon = interaction.options.getString("link");

    if (
      !interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD]) ||
      !interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])
    )
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${interaction.user.toString()}, You do not have permission to change the server icon!`
          ),
        ],
      });

    try {
      await interaction.guild.setIcon(newIcon);
      await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `Server Icon has been successfully changed!`),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Could not change the server icon!, ${error.message}`
          ),
        ],
      });
    }
  },
};
