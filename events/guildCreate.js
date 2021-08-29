const { registerSlashCommands } = require("../deploy-commands");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    await registerSlashCommands(guild.client.user.id, guild.id);
  },
};
