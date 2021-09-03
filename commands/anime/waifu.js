const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("waifu")
    .setDescription("gets waifu pic :P"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const waifu = await requestAPI("https://api.waifu.pics/sfw/waifu");
      const waifuEmbed = {
        color: "#9dcc37",
        image: {
          url: `${waifu.url}`,
        },
        timestamp: new Date(),
        footer: {
          text: `Requested by ${interaction.user.username}`,
          icon_url: `${interaction.user.avatarURL()}`,
        },
      };
      await interaction.followUp({ embeds: [waifuEmbed] });
    } catch (error) {
      await interaction.followUp(`Couldn't retrieve a waifu pic, Sorry!`);
    }
  },
};
