const { registerSlashCommands } = require("../modules/deploy-commands");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.guilds.cache.map(async (guild) => {
      try {
        await registerSlashCommands(client.user.id, guild.id);
      } catch (err) {
        console.error(
          `Could not register commands for a server!, ${err.message}`
        );
      }
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity(`Music in ${client.guilds.cache.size} Servers!`, {
      type: "PLAYING",
    });
  },
};
