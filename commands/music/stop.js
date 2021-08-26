const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the current song playing"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp(
        `<@${interaction.user.id}>, Nothing is playing to stop!`
      );
    }

    const embed = {
      color: "#9dcc37",
      description: `✅ Stopped **${queue.current.title}** in [<#${interaction.member.voice.channelId}>]`,
    };

    if (queue && queue.playing) {
      await queue.stop();
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
