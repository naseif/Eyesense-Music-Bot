const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

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

    if (interaction.member.permissions.has([Permissions.FLAGS.KICK_MEMBERS])) {
      try {
        await interaction.guild.members.kick(user, { reason });
        await interaction.followUp({ embeds: [embed] });
      } catch (error) {
        await interaction.followUp(`Couldn't kick ${user}, ${error.message}`);
        console.log(error);
      }
    }
  },
};
