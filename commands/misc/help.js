const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands for this bot!")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("show help by category")
        .addChoice("Admin", "admin")
        .addChoice("Fun", "fun")
        .addChoice("Music", "music")
        .addChoice("Misc", "misc")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const category = interaction.options.getString("category");

    function printHelpByCollection(collection) {
      const commands = collection.map(
        (command) =>
          "`" +
          `/${command.data.name} :` +
          "`" +
          " " +
          `${command.data.description}`
      );
      return commands;
    }

    let help;
    switch (category) {
      case "admin":
        help = printHelpByCollection(client.commands.admin);
        break;
      case "fun":
        help = printHelpByCollection(client.commands.fun);
        break;
      case "music":
        help = printHelpByCollection(client.commands.music);
        break;
      case "misc":
        help = printHelpByCollection(client.commands.misc);
        break;
      default:
        help = printHelpByCollection(client.commands);
    }

    const embed = {
      color: "#9dcc37",
      title: `${client.user.username}'s Commands!`,
      description: `${help.join("\n")}`,
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
