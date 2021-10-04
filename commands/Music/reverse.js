const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "reverse",
  aliases: ["rv"],
  args: true,
  description: "Sets reverse audio filter to your music",
  usage: "rv || reverse <on> || <off>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);
    const mode = args.join(" ");

    if (!queue)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Your Queue is empty, Make sure to play a song first`
          ),
        ],
      });

    if (!mode)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Please provide whether you want to on/off the filter`
          ),
        ],
      });

    switch (mode) {
      case "on":
        try {
          await queue.setFilters({
            reverse: true,
          });
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been enabled`),
            ],
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
          await queue.setFilters({});
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been disabled`),
            ],
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
    .setName("reverse")
    .setDescription("Reverse Audio Filter")
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
            reverse: true,
          });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been enabled`),
            ],
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
          await queue.setFilters({ reverse: false });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", `✅ Reverse Filter has been disabled`),
            ],
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
