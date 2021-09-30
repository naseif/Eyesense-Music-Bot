const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Sends the user's avatar")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    await interaction.deferReply();
    const embed = {
      color: "#9dcc37",
      fields: [
        {
          name: "User Avatar For: ",
          value: `${user}`,
          inline: true,
        },
      ],
      image: {
        url: `${user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })}`,
      },
      timestamp: new Date(),
    };

    await interaction.followUp({ embeds: [embed] });
  },
};
