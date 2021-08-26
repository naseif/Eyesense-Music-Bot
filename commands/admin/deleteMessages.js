const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletemessages")
    .setDescription("deletes x number of messages")
    .addIntegerOption((option) =>
      option.setName("int").setDescription("Enter an integer")
    ),
  async execute(interaction, client) {
    const integer = interaction.options.getInteger("int");
    await interaction.deferReply();

    try {
      const getMessages = await interaction.channel.messages.fetch({
        limit: 100,
      });
      await interaction.channel.bulkDelete(integer);
    } catch (error) {
      const errorEmbed = {
        color: "#9dcc37",
        description: `💥 ${error.message}`,
      };
      await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
