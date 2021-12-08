const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "hug",
  args: false,
  description: "Sends a hug gif",
  usage: "hug",
  async run(message, args, client) {
    console.log("hi");
    try {
      const hug = await client.apis.request("https://api.waifu.pics/sfw/hug");
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
      return await message.channel.send({ embeds: [hugEmbed] });
    } catch (error) {
      console.log(error);
      client.logger(error.message, "error");
      return await message.channel.send(
        `❌ | Couldn't retrieve a hug gif, Sorry!`
      );
    }
  },
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Sends a hug gif"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const hug = await client.apis.request("https://api.waifu.pics/sfw/hug");
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
      return await interaction.followUp({ embeds: [hugEmbed] });
    } catch (error) {
      client.logger(error.message, "error");
      return await interaction.followUp(
        `❌ | Couldn't retrieve a hug gif, Sorry!`
      );
    }
  },
};
