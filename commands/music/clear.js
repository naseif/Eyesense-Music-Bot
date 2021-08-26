const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clears the music queue"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        content: `${usermention}, ❌ | No Queue has been created for this guild. <Queue is empty>`,
      });
    }
    //

    const embed = {
      color: "#9dcc37",
      description: `✅ Queue Cleared! [<@${interaction.user.id}>]`,
    };

    if (queue) {
      await queue.clear();
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
