const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Shows some stats about the server"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const guild = interaction.guild;

    const statssEmbed = {
      color: "#9dcc37",
      title: `${guild.name}'s Stats`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
      thumbnail: {
        url: `${
          guild.iconURL() ? guild.iconURL() : interaction.user.avatarURL()
        }`,
      },
      fields: [
        {
          name: "Members",
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: "Owner",
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: "Created",
          value: `${guild.createdAt.toUTCString()}`,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: "Created by naseif",
        icon_url: "https://i.imgur.com/KrAvM8U.jpg",
      },
    };
    try {
      await interaction.followUp({ embeds: [statssEmbed] });
    } catch (err) {
      await interaction.followUp(
        `I was not able to fetch the server info, do I have permission ?`
      );
      console.error(err);
    }
  },
};
