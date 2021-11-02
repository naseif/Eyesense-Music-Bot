const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "jump",
  args: true,
  description: "Jumps to a particular position in the queue",
  usage: "jump <position>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | There is nothing playing at the moment`
          ),
        ],
      });

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `Please provide the position to jump`),
        ],
      });
    try {
      if (queue) {
        await queue.jump(Number(args[0]));
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ jumped to position ${args[0]} in the queue!`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", "Could not jump to this position")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jumps to a particular position in the queue")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("new position")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);
    const position = interaction.options.getInteger("position");
    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | There is nothing playing at the moment`
          ),
        ],
      });

    try {
      if (queue) {
        await queue.jump(Number(position));
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Jumped to position ${position} in the queue!`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            "Could not jump to this position because it does not exist!"
          ),
        ],
      });
    }
  },
};
