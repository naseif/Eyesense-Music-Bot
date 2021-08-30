const { registerSlashCommands } = require("../deploy-commands");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    await registerSlashCommands(guild.client.user.id, guild.id);
    const guilds = guild.client.guilds.cache.map((guild) => guild.id);
    guild.client.user.setActivity(`${guilds.length} Servers!`, {
      type: "WATCHING",
    });
  },
};
