const { SlashCommandBuilder } = require("@discordjs/builders");
const { requestAPI } = require("../../modules/requestAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("sends a hug gif"),
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
          icon_url: `${interaction.user.avatarURL()}`,
        },
      };
      await interaction.followUp({ embeds: [hugEmbed] });
    } catch (error) {
      await interaction.followUp(`Couldn't retrieve a hug gif, Sorry!`);
    }
  },
};
