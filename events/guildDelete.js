module.exports = {
  name: "guildDelete",
  async execute(guild) {
    const guilds = guild.client.guilds.cache.map((guild) => guild.id);
    guild.client.user.setActivity(`${guilds.length} Servers!`, {
      type: "WATCHING",
    });
    try {
      await guild.commands.set([]);
    } catch (err) {
      console.error(`Something went wrong, ${err.message}`);
    }
  },
};
