module.exports = {
  name: "guildDelete",
  async execute(guild) {
    try {
      await guild.commands.set([]);
    } catch (err) {
      console.error(`Something went wrong, ${err.message}`);
    }
  },
};
