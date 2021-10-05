const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { getAnimeByImage } = require("../../modules/getAnimeByImage");

module.exports = {
  name: "whatanime",
  aliases: ["wa"],
  args: true,
  description: "Scans an Image to get the anime name!",
  usage: "wa || whatanime <link>",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [embedMessage("#9dcc37", `You have to provide an image link!`)],
      });

    try {
      const res = await getAnimeByImage(args[0]);
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
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${message.member.user.avatarURL()}`,
        },
      };
      await message.channel.send({ embeds: [infoEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      await message.channel.send(
        `${interaction.user.toString()}, There was an error processing this image!`
      );
    }
  },
  data: new SlashCommandBuilder()
    .setName("whatanime")
    .setDescription("Scans an Image to get the anime name!")
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
