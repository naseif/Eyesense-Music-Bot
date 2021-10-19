const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  name: "hug",
  args: false,
  description: "Sends a hug gif",
  usage: "hug",
  async run(message, args, client) {
    try {
      const hug = await requestAPI("https://api.waifu.pics/sfw/hug");
      const hugEmbed = {
        color: "#9dcc37",
        image: {
          url: `${hug.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${
            message.member.user.avatarURL() || client.user.avatarURL()
          }`,
        },
      };
      await message.channel.send({ embeds: [hugEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send(`❌ | Couldn't retrieve a hug gif, Sorry!`);
    }
  },
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Sends a hug gif"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const hug = await requestAPI("https://api.waifu.pics/sfw/hug");
      const hugEmbed = {
        color: "#9dcc37",
        image: {
          url: `${hug.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${interaction.user.username}`,
          icon_url: `${
            interaction.user.avatarURL() || client.user.avatarURL()
          }`,
        },
      };
      await interaction.followUp({ embeds: [hugEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp(`❌ | Couldn't retrieve a hug gif, Sorry!`);
    }
  },
};
