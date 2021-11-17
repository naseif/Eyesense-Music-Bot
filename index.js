const { Client, Collection, Intents } = require("discord.js");
const { logger } = require("./modules/logger.js");
const { token, mongourl } = require("./config.json");
const { Database } = require("quickmongo");
const { connectDatabase } = require("./modules/DatabaseConnection");
const { commandsHelper } = require("./modules/commandsHelper");

if (!token || !mongourl)
  return logger(
    "Please add your mongourl and bot token to config.json to start the bot!",
    "error"
  );

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
client.db = new Database(mongourl);

// Register everything...
commandsHelper.registerAllCommands(__dirname + "/commands", client);
commandsHelper.registerAllEvents(__dirname + "/events", client);
playerEvents(client.player);

// Connect to DATABASE
connectDatabase(mongourl, client);
// ... and go!
client.login(token);
