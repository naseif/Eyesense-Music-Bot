const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("region")
    .setDescription(
      "changes the region of the voice channel the user is connected to"
    )
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("select the region you wish to set")
        .setRequired(true)
        .addChoice("Brazil", "brazil")
        .addChoice("Europe", "europe")
        .addChoice("Hong Kong", "hongkong")
        .addChoice("India", "india")
        .addChoice("Japan", "japan")
        .addChoice("Russia", "russia")
        .addChoice("Singapore", "singapore")
        .addChoice("Sydney", "sydney")
        .addChoice("South Africa", "southafrica")
        .addChoice("US Central", "us-central")
        .addChoice("US East", "us-east")
        .addChoice("US South", "us-south")
        .addChoice("US West", "us-west")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const voiceChannel = interaction.member.voice.channel;
    const region = interaction.options.getString("region");

    if (!voiceChannel) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You have to be connected to the voice channel to use this commnad\n see /regionbyid instead!`
          ),
        ],
      });
    }

    if (
      !interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) ||
      !interaction.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])
    ) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ ${interaction.member.toString()} You do not have permssion to edit the region of channels!`
          ),
        ],
      });
    }
    let currentRtc = voiceChannel.rtcRegion;
    try {
      await voiceChannel.setRTCRegion(region);
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Region of ${voiceChannel.toString()} has been changed from ${currentRtc} to ${
              voiceChannel.rtcRegion
            }`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ Could not change the region of this channel!`
          ),
        ],
      });
    }
  },
};
