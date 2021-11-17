const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "bassboost",
  aliases: ["bass"],
  args: true,
  description: "Sets bassboost audio filter to your music",
  usage: "bass <low> || <medium> || <high> || <off>, default <medium>",
  async run(message, args, client, prefix) {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });
    }

    switch (args[0]) {
      case "low":
        await queue.setFilters({ bassboost_low: true, normalizer2: true });
        await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Low Filter has been enabled`),
          ],
        });
        break;
      case "medium":
        await queue.setFilters({ bassboost: true, normalizer2: true });
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Bassboost Medium Filter has been enabled`
            ),
          ],
        });
        break;
      case "high":
        await queue.setFilters({ bassboost_high: true, normalizer2: true });
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Bassboost High Filter has been enabled`
            ),
          ],
        });
        break;
      case "off":
        await queue.setFilters({ normalizer2: true });
        await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Filter has been disabled`),
          ],
        });
        break;
      default:
        await queue.setFilters({ bassboost: true, normalizer2: true });
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Bassboost Medium Filter has been enabled, see ${prefix}h bass for more info about this command`
            ),
          ],
        });
        break;
    }
  },
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Sets bassboost audio filter to your music")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("ON/OFF")
        .setRequired(true)
        .addChoice("Low", "1")
        .addChoice("Medium", "2")
        .addChoice("High", "3")
        .addChoice("OFF", "4")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);
    const mode = interaction.options.getString("mode");

    if (!queue)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });
    switch (mode) {
      case "1":
        await queue.setFilters({ bassboost_low: true, normalizer2: true });
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Low Filter has been enabled`),
          ],
        });
        break;
      case "2":
        await queue.setFilters({ bassboost: true, normalizer2: true });
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Bassboost Medium Filter has been enabled`
            ),
          ],
        });
        break;
      case "3":
        await queue.setFilters({ bassboost_high: true, normalizer2: true });
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Bassboost High Filter has been enabled`
            ),
          ],
        });
        break;
      case "4":
        await queue.setFilters({
          normalizer2: true,
        });
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Filter has been disabled`),
          ],
        });
        break;
    }
  },
};
