const { registerSlashCommands } = require("../deploy-commands");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    let guilds = client.guilds.cache.map((guild) => guild.id);
    guilds.forEach(async (guildID) => {
      await registerSlashCommands(client.user.id, guildID);
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
