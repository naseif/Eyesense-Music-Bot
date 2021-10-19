const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");
const { getUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "kick",
  args: true,
  description: "Kicks a user from the server",
  usage: "kick <user> <reason>",
  async run(message, args, client) {
    const user = getUserFromMention(args[0], client);

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ | Please mention a user to kick!`),
        ],
      });

    const noargs0 = args.shift();
    const kickReason = args.join(" ");

    const embed = {
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
      color: "#9dcc37",
      title: `A user has been kicked! ✅`,
      fields: [
        {
          name: "User",
          value: `${user}`,
          inline: true,
        },
        {
          name: "Reason",
          value: `${kickReason}`,
        },
      ],
      timestamp: new Date(),
    };

    if (!message.member.permissions.has("KICK_MEMBERS"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You do not have permission to kick members!`
          ),
        ],
      });

    if (!user)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Could not resolve the user, Please mention the user you want to kick!`
          ),
        ],
      });

    try {
      await message.guild.members.kick(user, { kickReason });
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Couldn't kick ${user}, ${error.message}`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("kick reason").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const embed = {
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL() || client.user.avatarURL()}`,
      },
      color: "#9dcc37",
      title: `A user has been kicked!`,
      fields: [
        {
          name: "User",
          value: `${user}`,
          inline: true,
        },
        {
          name: "Reason",
          value: `${reason}`,
        },
      ],
      timestamp: new Date(),
    };

    if (!interaction.member.permissions.has([Permissions.FLAGS.KICK_MEMBERS]))
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You do not have permission to kick members!`
          ),
        ],
      });

    try {
      await interaction.guild.members.kick(user, { reason });
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `Couldn't kick ${user}, ${error.message}`),
        ],
      });
    }
  },
};
