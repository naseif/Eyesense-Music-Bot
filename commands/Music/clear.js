const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "clear",
  aliases: ["cl"],
  args: false,
  description: "Clears the Music Queue",
  usage: "cl || clear",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No Queue has been created for this guild`
          ),
        ],
      });
    }

    try {
      if (queue) {
        await queue.clear();
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Queue Cleared! [${message.member.toString()}]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            "Could not clear the queue, maybe there is no queue"
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clears the music queue"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No Queue has been created for this guild`
          ),
        ],
      });
    }

    try {
      if (queue) {
        await queue.clear();
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Queue Cleared! [<@${interaction.user.id}>]`
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
            "Could not clear the queue, maybe there is no queue"
          ),
        ],
      });
    }
  },
};
