const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listqueue")
    .setDescription("Shows the current queue"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);

    await interaction.deferReply();

    if (!queue) {
      return await interaction.followUp({
        content: `❌ | Nothing to list, Queue is empty `,
      });
    }
    const tracks = queue?.tracks?.map(
      (track) => `<@${track.requestedBy.id}>, ${track.title}`
    );

    const queueEmbed = {
      color: "#21c6cf",
      title: `Current Queue`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
        url: "https://github.com/naseif/",
      },
      description: `${tracks.join("\n")}`,
      timestamp: new Date(),
      footer: {
        text: "Created by naseif",
        icon_url: "https://i.imgur.com/yeuStLw.png",
      },
    };

    await interaction.followUp({ embeds: [queueEmbed] });
  },
};
