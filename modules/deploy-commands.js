const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token } = require("../config.json");
const rest = new REST({ version: "9" }).setToken(token);
const { commandsHelper } = require("./commandsHelper");

module.exports.registerSlashCommands = async (clientId, guildId) => {
  try {
    let commands = commandsHelper.getAllCommandsAsJson(__dirname + "/../commands");
    
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
};
