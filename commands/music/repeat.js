const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("repeats the current song")
    .addStringOption((option) =>
      option
        .setName("modes")
        .setDescription("repeat modes - Can be queue or song")
        .setRequired(true)
        .addChoice("OFF", "0")
        .addChoice("TRACK", "1")
        .addChoice("QUEUE", "2")
        .addChoice("AUTOPLAY", "3")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const usermention = `<@${interaction.member.id}>`;
    const queue = client.player.getQueue(interaction.guild);
    const mode = interaction.options.getString("modes");

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${usermention}, ❌ | No music is being played!`
          ),
        ],
      });
    }

    switch (mode) {
      case "0":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ | Repeat Mode has been disabled`),
          ],
        });
        break;
      case "1":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for **${queue.current}**`
            ),
          ],
        });

        break;
      case "2":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for the current queue!`
            ),
          ],
        });

        break;
      case "3":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ | Autoplay mode has been enabled `),
          ],
        });
        break;
    }
  },
};
