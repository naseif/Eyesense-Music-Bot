const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "unban",
  args: true,
  description: "Unbans a user from the server",
  usage: "unban <userid>",
  async run(message, args, client) {
    const userID = args[0];

    if (!userID)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | Please provide the user id of the user you wish to unban`
          ),
        ],
      });

    const noargs0 = args.shift();
    const unbanReason = args.join(" ");

    const embed = {
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
      color: "#9dcc37",
      title: `User unbanned successfully ✅`,
      fields: [
        {
          name: "User ID:",
          value: `${userID}`,
          inline: true,
        },
        {
          name: "Reason",
          value: `${unbanReason}`,
        },
      ],
      timestamp: new Date(),
    };

    if (!message.member.permissions.has("ADMINISTRATOR"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You do not have permission to unban members!`
          ),
        ],
      });

    try {
      await message.guild.members.unban(userID, { unbanReason });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | Couldn't ban <@${userID}>, ${error.message}`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unbans a user with id")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the user you want to unabn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("ban reason").setRequired(true)
    ),
  async execute(interaction, client) {
    const userID = interaction.options.getString("id");
    const reason = interaction.options.getString("reason");
    await interaction.deferReply();

    const embed = {
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL() || client.user.avatarURL()}`,
      },
      color: "#9dcc37",
      title: `User unbanned successfully`,
      fields: [
        {
          name: "User ID:",
          value: `${userID}`,
          inline: true,
        },
        {
          name: "Reason",
          value: `${reason}`,
        },
      ],
      timestamp: new Date(),
    };

    if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You do not have permission to unban members!`
          ),
        ],
      });

    try {
      await interaction.guild.members.unban(userID, { reason });
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | Couldn't ban <@${userID}>, ${error.message}`
          ),
        ],
      });
    }
  },
};
