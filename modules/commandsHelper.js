/***
 * CommandsHelper - Help for commands
 *
 * It may make no sense, but it is ours!
 */
const fs = require("fs");

let commandsHelper = function () {
  let api = {};

  /**
   * Collects all available commands
   *
   * @param {string} commandsFolder Path to folder that contains all commands
   * @returns array of commands
   */
  api.getAllCommands = function (commandsFolder) {
    var result = [];
    const allCommandsFolders = fs.readdirSync(commandsFolder);

    for (const folder of allCommandsFolders) {
      const commandFiles = fs
        .readdirSync(`${commandsFolder}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`${commandsFolder}/${folder}/${file}`);
        command.category = folder;
        result.push(command);
      }
    }

    return result;
  };

  /**
   * Registers all commands in the given subdirectory into the client collection
   *
   * @param {string} commandsFolder Path to folder that contains all commands
   * @param {Client} client The discord client
   */
  api.registerAllCommands = function (commandsFolder, client) {
    let commands = api.getAllCommands(commandsFolder);

    for (const command of commands) {
      client.commands.set(command.data.name, command);
    }
  };

  /**
   * Get an array of json definitions for registering slash commands
   *
   * @param {string} commandsFolder Path to folder that contains all commands
   * @returns an array of json definitions
   */
  api.getAllCommandsAsJson = function (commandsFolder) {
    let commands = api.getAllCommands(commandsFolder);

    let result = [];
    for (const command of commands) {
      result.push(command.data.toJSON());
    }

    return result;
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
      if (event.run) {
        if (event.once) {
          client.once(event.name, (...args) => event.run.bind(...args, client));
          console.log(`Registered Run Once: ${event.name}`);
        } else {
          client.on(event.name, (...args) => event.run.bind(...args, client));
          console.log(`Registered Run On: ${event.name}`);
        }
      } else {
        if (event.once) {
          client.once(event.name, (...args) => event.execute.bind(...args, client));
          console.log(`Registered Once: ${event.name}`);
        } else {
          client.on(event.name, (...args) => event.execute.bind(...args, client));
          console.log(`Registered On: ${event.name}`);
        }
      }
    }
  };

  return api;
};

module.exports.commandsHelper = commandsHelper();
