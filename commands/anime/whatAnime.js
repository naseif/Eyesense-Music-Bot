const { SlashCommandBuilder } = require("@discordjs/builders");
const { getAnimeByImage } = require("./../../modules/getAnimeByImage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whatanime")
    .setDescription("Scans an Image to get the anime name! <whatanime 'link'>")
    .addStringOption((option) =>
      option.setName("image").setDescription("Image Link").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const imageLink = interaction.options.getString("image");
    try {
      const res = await getAnimeByImage(imageLink);
      const resultArray = res.result.slice(0, 3).map((info, index) => {
        return (
          `${index + 1}: ` +
          "`" +
          `${
            info.anilist.title.english
              ? info.anilist.title.english
              : `Not Available`
          }` +
          "`" +
          " **AKA** " +
          "`" +
          `${info.anilist.title.romaji}` +
          "`" +
          " **Similarity** " +
          `${info.similarity.toFixed(2) * 100}%`
        );
      });
      const infoEmbed = {
        color: "#9dcc37",
        title: "Search Result",
        description: `${resultArray.join("\n")}`,
        timestamp: new Date(),
        footer: {
          text: `Requested by ${interaction.user.username}`,
          icon_url: `${interaction.user.avatarURL()}`,
        },
      };
      await interaction.followUp({ embeds: [infoEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      await interaction.followUp(
        `${interaction.user.toString()}, There was an error processing this image!`
      );
    }
  },
};
