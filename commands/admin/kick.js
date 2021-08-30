const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kicks a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("kick reason").setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    await interaction.deferReply();

    const embed = {
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
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
      await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `Couldn't kick ${user}, ${error.message}`),
        ],
      });
      console.log(error);
    }
  },
};
