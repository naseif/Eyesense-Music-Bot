module.exports = {
  name: "guildMemberAdd",
  async execute(guild) {
    const welcomeEmbed = {
      color: "#9dcc37",
      title: `New Member joined!`,
      thumbnail: {
        url: `${guild.user.avatarURL()}`,
      },
      fields: [
        {
          name: ":man_detective: Member",
          value: `${guild.toString()}`,
        },
        {
          name: ":clock2: Joined Server",
          value: `${guild.joinedAt.toDateString()}`,
        },
        {
          name: ":chart_with_downwards_trend: Member Number",
          value: `#${guild.guild.memberCount}`,
        },
        {
          name: ":calendar_spiral: Joined Discord",
          value: `${guild.user.createdAt.toDateString()}`,
        },
      ],
    };

    if (guild.guild.systemChannel) {
      guild.guild.systemChannel.send({
        content: `Hey ${guild.toString()}, Welcome to ${
          guild.guild.name
        }! :partying_face:`,
        embeds: [welcomeEmbed],
      });
    } else {
      return;
    }
  },
};
