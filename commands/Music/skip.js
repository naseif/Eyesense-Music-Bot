const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "skip",
  args: false,
  description: "Skips to the next song in the Queue",
  aliases: ["s"],
  usage: "s || skip",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No music is being played! [${message.member.toString()}]`
          ),
        ],
      });

    try {
      const currnetSong = queue.current;
      await queue.skip();
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Skipped **${currnetSong.title}**, [${message.member.toString()}]`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", "Song could not be skipped")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips a song from the queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No music is being played! [${interaction.member.toString()}]`
          ),
        ],
      });

    try {
      const currnetSong = queue.current;
      await queue.skip();
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Skipped **${
              currnetSong.title
            }**, [${interaction.member.toString()}]`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", "Song could not be skipped")],
      });
    }
  },
};
