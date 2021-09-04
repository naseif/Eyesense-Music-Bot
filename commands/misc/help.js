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
        .addChoice("Anime", "anime")
        .addChoice("Fun", "fun")
        .addChoice("Music", "music")
        .addChoice("Misc", "misc")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const category = interaction.options.getString("category");

    function printHelpByCollection(collection, category) {
      const commands = collection
        .filter((item) => item.category === category || category === null)
        .map((command) => {
          return (
            "`" +
            `/${command.data.name} :` +
            "`" +
            " " +
            `${command.data.description}`
          );
        });
      return commands;
    }
    let help;
    help = printHelpByCollection(client.commands, category);

    const embed = {
      color: "#9dcc37",
      title: `${client.user.username}'s Commands!`,
      description: `${help.join("\n")}`,
      timestamp: new Date(),
      footer: {
        text: `Requested by ${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
    };

    await interaction.followUp({ embeds: [embed] });
  },
};
