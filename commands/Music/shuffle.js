const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "shuffle",
  args: false,
  description: "Shuffles The Music Queue",
  usage: "shuffle",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue)
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ | There is no queue to shuffle!`)],
      });

    try {
      await queue.shuffle();
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Queue has been shuffled [${message.member.toString()}]`
          ),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send({
        embeds: [embedMessage("RED", "❌ Could not shuffle the queue")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles The Music Queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue)
      return await interaction.followUp({
        embeds: [embedMessage("RED", `❌ | There is no queue to shuffle!`)],
      });

    try {
      await queue.shuffle();
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Queue has been shuffled [${interaction.member.toString()}]`
          ),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      return await interaction.followUp({
        embeds: [embedMessage("RED", "❌ Could not shuffle the queue")],
      });
    }
  },
};
