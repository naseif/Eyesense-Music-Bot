const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands for this bot!"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const commands = client.commands.map(
      (command) => `**${command.data.name}** - ${command.data.description}`
    );
    const embed = {
      color: "#9dcc37",
      title: `${client.user.username}'s Commands!`,
      description: `${commands.join("\n")}`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
      timestamp: new Date(),
      footer: {
        text: "Created by naseif",
        icon_url: "https://i.imgur.com/KrAvM8U.jpg",
      },
    };

    await interaction.followUp({ embeds: [embed] });
  },
};
