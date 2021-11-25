module.exports = {
  name: "guildDelete",
  async execute(guild) {
    guild.client.user.setActivity(
      `Music in ${client.guilds.cache.size} Servers!`,
      {
        type: "PLAYING",
      }
    );
  },
};
