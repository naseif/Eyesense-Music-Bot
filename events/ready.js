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
    const guilds = client.guilds.cache.map((guild) => guild.id);
    client.user.setActivity(`${guilds.length} Servers!`, {
      type: "WATCHING",
    });
  },
};
