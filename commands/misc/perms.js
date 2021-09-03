const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perms")
    .setDescription("Shows the permission for another member or your own")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");
    await interaction.deferReply();

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
        icon_url: `${interaction.user.avatarURL()}`,
      },
    };
    try {
      await interaction.followUp({
        embeds: [permsEmbed],
      });
    } catch (err) {
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
