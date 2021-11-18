module.exports = {
  name: "guildMemberRemove",
  async execute(guild) {
    const checkCustomChannel = await guild.client.db.get(
      `leave_${guild.guild.id}`
    );

    const welcomeEmbed = {
      color: "#9dcc37",
      title: `Member left the server!`,
      thumbnail: {
        url: `${
          guild.user.avatarURL() ||
          guild.guild.iconURL() ||
          guild.guild.client.user.avatarURL()
        }`,
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
          name: ":calendar_spiral: Joined Discord",
          value: `${guild.user.createdAt.toDateString()}`,
        },
      ],
    };

    const sendWelcome = (channel) => {
      return channel.send({
        embeds: [welcomeEmbed],
      });
    };

    if (checkCustomChannel) {
      const customchannel = guild.guild.channels.cache.find(
        (channel) => channel.id === checkCustomChannel
      );
      if (!customchannel) return;
      return sendWelcome(customchannel);
    }

    if (guild.guild.systemChannel) {
      return sendWelcome(guild.guild.systemChannel);
    } else {
      return;
    }
  },
};
