const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { msToTime } = require("../../modules/mstoTime");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  description:
    "Shows since how long the bot is online, refreshes every 24 hours!",
  usage: "up || uptime",
  args: false,
  async run(message, args, client) {
    await message.channel.send({
      embeds: [
        embedMessage(
          "#9dcc37",
          `${client.user.username}' Uptime: ${msToTime(client.uptime)}`
        ),
      ],
    });
  },
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Since how long the bot is online"),
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        embedMessage(
          "#9dcc37",
          `${client.user.username}' Uptime: ${msToTime(client.uptime)}`
        ),
      ],
    });
  },
};
