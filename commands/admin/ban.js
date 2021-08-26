const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("ban reason").setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    await interaction.deferReply();

    const embed = {
      color: "#9dcc37",
      title: `A user has been Banned!`,
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

    if (interaction.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS])) {
      try {
        await interaction.guild.members.ban(user, { reason });
        await interaction.followUp({ embeds: [embed] });
      } catch (error) {
        await interaction.followUp(`Couldn't ban ${user}, ${error.message}`);
        console.log(error);
      }
    }
  },
};
