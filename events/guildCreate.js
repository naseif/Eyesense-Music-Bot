const { registerSlashCommands } = require("../deploy-commands");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    if (guild.systemChannel) {
      guild.systemChannel.send({
        content: "**Thanks for adding me to your server!**",
        files: ["https://nekos.best/api/v1/cuddle/017.gif"],
      });
    } else {
      return;
    }
    await registerSlashCommands(guild.client.user.id, guild.id);
    const guilds = guild.client.guilds.cache.map((guild) => guild.id);
    guild.client.user.setActivity(`${guilds.length} Servers!`, {
      type: "WATCHING",
    });
  },
};
