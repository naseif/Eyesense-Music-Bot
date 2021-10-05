const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "8d",
  args: true,
  description: "Sets 8D audio filter to your music",
  usage: "8d <on> || <off>",
  async run(message, args, client, prefix) {
    const queue = client.player.getQueue(message.guild);

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

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Please provide whether you want to on/off the filter, see ${prefix}h 8d for more info about this command`
          ),
        ],
      });

    switch (args[0]) {
      case "on":
        try {
          await queue.setFilters({
            "8D": true,
          });
          await message.channel.send({
            embeds: [embedMessage("#9dcc37", `✅ 8D Filter has been enabled`)],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await message.channel.send({
            embeds: [embedMessage("#9dcc37", `Could not set the Filter`)],
          });
        }
        break;
      case "off":
        try {
          await queue.setFilters({normalizer: true});
          await message.channel.send({
            embeds: [embedMessage("#9dcc37", `✅ 8D Filter has been disabled`)],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await message.channel.send({
            embeds: [embedMessage("#9dcc37", `Could not disable the filter`)],
          });
        }
        break;
    }
  },
  data: new SlashCommandBuilder()
    .setName("8d")
    .setDescription("Sets 8D audio filter to your music")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("ON/OFF")
        .setRequired(true)
        .addChoice("ON", "1")
        .addChoice("OFF", "0")
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
        try {
          await queue.setFilters({
            "8D": true,
          });
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `✅ 8D Filter has been enabled`)],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `Could not set the Filter`)],
          });
        }
        break;
      case "0":
        try {
          await queue.setFilters({ "8D": false });
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `✅ 8D Filter has been disabled`)],
          });
        } catch (error) {
          client.logger(error.message, "error");
          await interaction.followUp({
            embeds: [embedMessage("#9dcc37", `Could not disable the filter`)],
          });
        }
    }
  },
};
