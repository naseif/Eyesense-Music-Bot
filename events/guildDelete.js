module.exports = {
  name: "guildDelete",
  async execute(guild) {
    guild.client.user.setActivity(
      `Music in ${guild.client.guilds.cache.size} Servers!`,
      {
        type: "PLAYING",
      }
    );
  },
};
