const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
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
        icon_url: `${interaction.user.avatarURL()}`,
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
            "#9dcc37",
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
            "#9dcc37",
            `Couldn't ban <@${userID}>, ${error.message}`
          ),
        ],
      });
      console.log(error);
    }
  },
};
