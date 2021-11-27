module.exports = {
  name: "guildDelete",
  async execute(guild) {
    const guilds = client.guilds.cache.map((guild) => guild.id);
    client.user.setActivity(`Music in ${guilds.length} Servers!`, {
      type: "PLAYING",
    });
  },
};
