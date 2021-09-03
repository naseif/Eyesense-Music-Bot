const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("sends a highfive gif"),
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
      await interaction.followUp({ embeds: [highFiveEmbed] });
    } catch (error) {
      await interaction.followUp(`Couldn't retrieve a hug gif, Sorry!`);
    }
  },
};
