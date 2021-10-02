/***
 * CommandsHelper - Help for commands
 *
 * It may make no sense, but it is ours!
 */
const fs = require("fs");

let commandsHelper = function () {
  let api = {};

  /**
   * Registers all commands in the given subdirectory into the client collection
   *
   * @param {string} commandsFolder Path to folder that contains all commands
   * @param {Client} client The discord client
   */
  api.registerAllCommands = function (commandsFolder, client) {
    const allCommandsFolders = fs.readdirSync(commandsFolder);

    for (const folder of allCommandsFolders) {
      const commandFiles = fs
        .readdirSync(`${commandsFolder}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`${commandsFolder}/${folder}/${file}`);
        command.category = folder;
        client.commands.set(command.data.name, command);
      }
    }
  };

  /**
   * Registers all events in the given subdirectory on the client
   *
   * @param {string} eventFolder Path to folder that contains all events
   * @param {Client} client The discord client
   */
  api.registerAllEvents = function (eventFolder, client) {
    const eventFiles = fs
      .readdirSync(eventFolder)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`${eventFolder}/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  };

  return api;
};

module.exports.commandsHelper = commandsHelper();
