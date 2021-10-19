const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { getGuildUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "permissions",
  aliases: ["perm"],
  description: "Shows the permission for another member or your own",
  usage: "perm || permissions <user>",
  args: true,
  async run(message, args, client) {
    let userRoles;
    let guildUser;
    if (!args[0]) {
      userRoles = await message.member.roles.cache.map((role) => {
        if (role.name !== "@everyone") return `<@&${role.id}>`;
      });
    }

    if (args[0]) {
      guildUser = getGuildUserFromMention(args[0], message);
      if (!guildUser)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `I was not able to resolve this user, please mention the user!`
            ),
          ],
        });

      if (guildUser) {
        userRoles = await guildUser.roles.cache.map((role) => {
          if (role.name !== "@everyone") return `<@&${role.id}>`;
        });
      }
    }

    const permsEmbed = {
      color: "#9dcc37",
      title: `Roles list for ${
        guildUser ? guildUser.user.username : message.member.user.username
      }`,
      description: `${userRoles.join("\n")}`,

      timestamp: new Date(),
      footer: {
        text: `Requested by ${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
    };

    try {
      await message.channel.send({
        embeds: [permsEmbed],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Ups! Looks like I do not have permission to list the roles or something else went wrong!`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("perms")
    .setDescription("Shows the permission for another member or your own")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");

    let userRoles;

    if (user) {
      userRoles = await user.roles.cache.map((role) => {
        if (role.name !== "@everyone") return `<@&${role.id}>`;
      });
    } else {
      userRoles = await interaction.member.roles.cache.map((role) => {
        if (role.name !== "@everyone") return `<@&${role.id}>`;
      });
    }

    const permsEmbed = {
      color: "#9dcc37",
      title: `Roles list for ${
        user ? user.user.username : interaction.user.username
      }`,
      description: `${userRoles.join("\n")}`,

      timestamp: new Date(),
      footer: {
        text: `Requested by ${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL() || client.user.avatarURL()}`,
      },
    };
    try {
      await interaction.followUp({
        embeds: [permsEmbed],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Ups! Looks like I do not have permission to list the roles or something else went wrong!`
          ),
        ],
      });
    }
  },
};
