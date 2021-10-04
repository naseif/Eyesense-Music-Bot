const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const playdl = require("play-dl");

module.exports = {
  name: "247",
  args: true,
  description: "Sets 24/7 Mode for the bot",
  usage: "247 <on> || <off>",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Please specify whether you want to on/off the 24/7 Mode, see ${prefix}h 247 for more info about this command`
          ),
        ],
      });

    if (!queue) {
      switch (args[0]) {
        case "on":
          const OnQueue = client.player.createQueue(message.guild, {
            leaveOnEnd: false,
            leaveOnStop: false,
            leaveOnEmpty: false,
            initialVolume: 80,
            bufferingTimeout: 200,
            async onBeforeCreateStream(track, source, _queue) {
              if (source === "youtube") {
                return (await playdl.stream(track.url)).stream;
              }
            },
          });
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been activated"),
            ],
          });
          break;
        case "off":
          const OffQueue = client.player.createQueue(message.guild, {
            leaveOnEnd: false,
            leaveOnStop: true,
            leaveOnEmpty: true,
            initialVolume: 80,
            bufferingTimeout: 200,
            leaveOnEmptyCooldown: 60 * 1000 * 3,
            async onBeforeCreateStream(track, source, _queue) {
              if (source === "youtube") {
                return (await playdl.stream(track.url)).stream;
              }
            },
          });
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been deactivated"),
            ],
          });
          break;
      }
    }

    if (queue) {
      switch (args[0]) {
        case "on":
          queue.options.leaveOnEnd = false;
          queue.options.leaveOnStop = false;
          queue.options.leaveOnEmpty = false;
          queue.options.initialVolume = 80;
          queue.options.bufferingTimeout = 200;
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been activated"),
            ],
          });
          break;
        case "off":
          queue.options.leaveOnEnd = false;
          queue.options.leaveOnStop = true;
          queue.options.leaveOnEmpty = true;
          queue.options.leaveOnEmptyCooldown = 60 * 1000 * 3;
          await message.channel.send({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been deactivated"),
            ],
          });
          break;
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName("247")
    .setDescription("Sets 24/7 Mode for the bot")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("ON/OFF")
        .setRequired(true)
        .addChoice("ON", "0")
        .addChoice("OFF", "1")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);
    const status = interaction.options.getString("status");

    if (!queue) {
      switch (status) {
        case "0":
          const OnQueue = client.player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnStop: false,
            leaveOnEmpty: false,
            initialVolume: 80,
            bufferingTimeout: 200,
            async onBeforeCreateStream(track, source, _queue) {
              if (source === "youtube") {
                return (await playdl.stream(track.url)).stream;
              }
            },
          });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been activated"),
            ],
          });
          break;
        case "1":
          const OffQueue = client.player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnStop: true,
            leaveOnEmpty: true,
            initialVolume: 80,
            bufferingTimeout: 200,
            leaveOnEmptyCooldown: 60 * 1000 * 3,
            async onBeforeCreateStream(track, source, _queue) {
              if (source === "youtube") {
                return (await playdl.stream(track.url)).stream;
              }
            },
          });
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been deactivated"),
            ],
          });
          break;
      }
    }

    if (queue) {
      switch (status) {
        case "0":
          queue.options.leaveOnEnd = false;
          queue.options.leaveOnStop = false;
          queue.options.leaveOnEmpty = false;
          queue.options.initialVolume = 80;
          queue.options.bufferingTimeout = 200;
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been activated"),
            ],
          });
          break;
        case "1":
          queue.options.leaveOnEnd = false;
          queue.options.leaveOnStop = true;
          queue.options.leaveOnEmpty = true;
          queue.options.leaveOnEmptyCooldown = 60 * 1000 * 3;
          await interaction.followUp({
            embeds: [
              embedMessage("#9dcc37", "✅ 24/7 Mode has been deactivated"),
            ],
          });
          break;
      }
    }
  },
};
