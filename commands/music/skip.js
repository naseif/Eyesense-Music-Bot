const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

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
        embeds: [
          await embedMessage(
            "#9dcc37",
            `❌ | No music is being played! [${usermention}]`
          ),
        ],
      });

    const currnetSong = queue.current;
    await queue.skip();
    return await interaction.followUp({
      embeds: [
        await embedMessage(
          "#9dcc37",
          `Skipped **${currnetSong.title}**, [<@${interaction.user.id}>]`
        ),
      ],
    });
  },
};
