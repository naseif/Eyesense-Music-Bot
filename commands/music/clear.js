const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clears the music queue"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    const embed = {
      color: "#9dcc37",
      description: `✅ Queue Cleared! [<@${interaction.user.id}>]`,
    };

    const embedError = {
      color: "#9dcc37",
      description: `❌ | No Queue has been created for this guild. <Queue is empty>`,
    };

    if (!queue) {
      return await interaction.followUp({ embeds: [embedError] });
    }

    if (queue) {
      await queue.clear();
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
