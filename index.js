const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_BANS,
  ],
  restRequestTimeout: 30000,
});
const { commandsReadMe } = require("./modules/commandsReadMe");
const { findAndRequire } = require("./modules/loopAndRequireCommands");
const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
client.commands = new Collection();
const admin = (client.commands.admin = new Collection());
const fun = (client.commands.fun = new Collection());
const music = (client.commands.music = new Collection());
const misc = (client.commands.misc = new Collection());


// Admin Commands
findAndRequire("commands/admin", ".js", admin);

// Fun Commands
findAndRequire("commands/fun", ".js", fun);

// Music Commands
findAndRequire("commands/music", ".js", music);

// Misc Commands
findAndRequire("commands/misc", ".js", misc);

// All commands!

const allCommandsFolders = fs.readdirSync("./commands");

for (const folder of allCommandsFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

// Loop through the events and require them
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Loop through the discord-player events and require them
const botEvents = fs
  .readdirSync("./playerEvents")
  .filter((file) => file.endsWith(".js"));

for (const file of botEvents) {
  const event = require(`./playerEvents/${file}`);
  player.on(event.name, event.execute);
}

// Initialize the client on interaction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
