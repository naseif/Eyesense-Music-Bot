const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the current song playing"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    if (queue) {
      await interaction.reply(`Stopped ${queue.current.title}`);
      await queue.stop();
    }
  },
};
