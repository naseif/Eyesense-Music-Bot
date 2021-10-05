const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "serverstats",
  aliases: ["ss"],
  args: false,
  description: "Shows some stats about the server",
  usage: "ss || serverstats",
  async run(message, args, client) {
    const guild = message.guild;

    const statssEmbed = {
      color: "#9dcc37",
      title: `${guild.name}'s Stats`,
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${message.member.user.avatarURL()}`,
      },
      thumbnail: {
        url: `${
          guild.iconURL() ? guild.iconURL() : message.member.user.avatarURL()
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
    };
    try {
      await message.channel.send({ embeds: [statssEmbed] });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send(
        `I was not able to fetch the server info, do I have permission ?`
      );
      console.error(err);
    }
  },
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
    };
    try {
      await interaction.followUp({ embeds: [statssEmbed] });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp(
        `I was not able to fetch the server info, do I have permission ?`
      );
      console.error(err);
    }
  },
};
