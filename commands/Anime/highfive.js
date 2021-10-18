const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");
const { getUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "highfive",
  aliases: ["hf"],
  args: false,
  description: "Sends a highfive gif",
  usage: "hf || highfive",
  async run(message, args, client) {
    try {
      const user = getUserFromMention(args[0], client);
      const highFive = await requestAPI("https://api.waifu.pics/sfw/highfive");
      const highFiveEmbed = {
        color: "#9dcc37",
        image: {
          url: `${highFive.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${message.member.user.avatarURL()}`,
        },
      };
      await message.channel.send({
        embeds: [highFiveEmbed],
        content: `${user ? user : `${message.member.toString()}`}`,
      });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send(`❌ | Couldn't retrieve a hug gif, Sorry!`);
    }
  },
  data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("Sends a highfive gif"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const highFive = await requestAPI("https://api.waifu.pics/sfw/highfive");
      const highFiveEmbed = {
        color: "#9dcc37",
        image: {
          url: `${highFive.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${interaction.user.username}`,
          icon_url: `${interaction.user.avatarURL()}`,
        },
      };
      await interaction.followUp({
        embeds: [highFiveEmbed],
      });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp(`❌ | Couldn't retrieve a hug gif, Sorry!`);
    }
  },
};
