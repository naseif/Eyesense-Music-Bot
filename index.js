const { Client, Collection, Intents } = require("discord.js");
const { logger } = require("./modules/logger.js");
const { token, prefix } = require("./config.json");
const { commandsHelper } = require("./modules/commandsHelper");

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
const { playerEvents } = require("./playerEvents/player");
const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
client.commands = new Collection();
client.logger = logger;

// Register everything...
commandsHelper.registerAllCommands("./commands", client);
commandsHelper.registerAllEvents("./events", client);
playerEvents(client.player);

// ... and go!
client.login(token);
