const { registerSlashCommands } = require("../modules/deploy-commands");
const { prefix } = require("../config.json");
module.exports = {
  name: "guildCreate",
  async execute(guild) {
    if (guild.systemChannel) {
      guild.systemChannel.send({
        content:
          `**Thanks for adding me to your server!**\n- I am programmed with discord's latest slash commands feature!\n- to use me just type / and select a command to get started!\n- I also support commands with aliases, type ` +
          "`" +
          `${prefix}help` +
          "`" +
          ` for more Info.\n- To set a custom prefix, type ` +
          "`" +
          `${prefix}setup <new prefix>` +
          "`",
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
