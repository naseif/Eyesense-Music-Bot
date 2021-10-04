const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "resume",
  args: false,
  description: "Resumes a paused song",
  aliases: ["r"],
  usage: "r || resume",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ | There is nothing playing to resume!`),
        ],
      });

    try {
      if (queue) {
        await queue.setPaused(false);
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${
                queue.current.title
              }** resumed [${message.member.toString()}]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", "I was not able to resume this song")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes a paused song"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ | There is nothing playing to resume!`),
        ],
      });

    try {
      if (queue) {
        await queue.setPaused(false);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${
                queue.current.title
              }** resumed [${interaction.member.toString()}]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", "I was not able to resume this song")],
      });
    }
  },
};
