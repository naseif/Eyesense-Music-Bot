const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips a song from the queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const usermention = `<@${interaction.member.id}>`;
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing)
      return await interaction.followUp({
        content: `${usermention}, ❌ | No music is being played!`,
      });

    const currnetSong = queue.current;
    await queue.skip();

    const embed = {
      color: "#9dcc37",
      description: `Skipped **${currnetSong.title}**, [<@${interaction.user.id}>]`,
    };
    return await interaction.followUp({ embeds: [embed] });
  },
};
