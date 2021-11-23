const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "seek",
  args: false,
  description: "Seek to the given time",
  usage: "seek <number in seconds>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ | There is nothing playing to seek!`)],
      });

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | Please provide how many seconds you wish to seek!`
          ),
        ],
      });

    const time = Number(args[0]) * 1000;

    try {
      await queue.seek(time);
      const embed = {
        color: "#9dcc37",
        description: `✅ **${queue.current.title}** has been seeked ${
          time / 1000
        } seconds! [${message.member.toString()}]`,
      };
      return await message.channel.send({ embeds: [embed] });
    } catch (err) {
      client.logger(err.message, "error");
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ Could not seek the song!`)],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("seeks the current song to the given position")
    .addIntegerOption((option) =>
      option.setName("sec").setDescription("Enter time in seconds")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guild);
    const seekNumber = interaction.options.getInteger("sec") * 1000;

    if (!queue || !queue.playing)
      return await interaction.followUp(
        `❌ | There is nothing playing to seek!`
      );

    try {
      await queue.seek(seekNumber);
      const embed = {
        color: "#9dcc37",
        description: `✅ **${queue.current.title}** has been seeked ${
          seekNumber / 1000
        } seconds! [${interaction.member.toString()}]`,
      };
      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
