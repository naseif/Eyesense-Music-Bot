const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips a song from the queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const usermention = `<@${interaction.member.id}>`;
    const queue = client.player.getQueue(interaction.guild);

    const embedError = {
      color: "#9dcc37",
      description: `❌ | No music is being played! [${usermention}]`,
    };

    const embed = {
      color: "#9dcc37",
      description: `Skipped **${currnetSong.title}**, [<@${interaction.user.id}>]`,
    };

    if (!queue || !queue.playing)
      return await interaction.followUp({ embeds: [embedError] });

    const currnetSong = queue.current;
    await queue.skip();
    return await interaction.followUp({ embeds: [embed] });
  },
};
