const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "bassboost",
  aliases: ["bass"],
  args: true,
  description: "Sets bassboost audio filter to your music",
  usage: "bassboost <on> || <off>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "9dcc37",
            `Please provide whether you want to on/off the filter`
          ),
        ],
      });

    if (!queue) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });
    }

    switch (args[0]) {
      case "low":
        await queue.setFilters({ bassboost_low: true });
        await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Low Filter has been enabled`),
          ],
        });
        break;
      case "medium":
        await queue.setFilters({ bassboost: true });
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
        await queue.setFilters({ bassboost_high: true });
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
        await queue.setFilters({});
        await queue.setFilters({ normalizer: true });
        await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Filter has been disabled`),
          ],
        });
        break;
    }
  },
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("bassboost Audio Filter")
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
            "#9dcc37",
            `Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });
    switch (mode) {
      case "1":
        await queue.setFilters({ bassboost_low: true });
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ Bassboost Low Filter has been enabled`),
          ],
        });
        break;
      case "2":
        await queue.setFilters({ bassboost: true });
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
        await queue.setFilters({ bassboost_high: true });
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
          bassboost_low: false,
          bassboost_high: false,
          bassboost: false,
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
