const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("disconnects from the channel"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    const embed = {
      color: "#9dcc37",
      description: `✅ **${interaction.client.user.username}** disconnected from [<#${interaction.member.voice.channelId}>]`,
    };
    if (queue) {
      await queue.destroy(true);
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
