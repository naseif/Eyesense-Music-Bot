const { Client, Collection, Intents } = require('discord.js');
const { token, mongourl } = require('./config.json');
const { Database } = require('quickmongo');
const { commandsHelper } = require('./modules/commandsHelper');
const { Utils, APIs, StringUtils } = require('devtools-ts');
const Utilities = new Utils();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_BANS
	],
	restRequestTimeout: 30000,
	shards: 'auto'
});
const { playerEvents } = require('./playerEvents/player');
const { Player } = require('discord-player');
const player = new Player(client);
client.player = player;
client.commands = new Collection();
client.logger = Utilities.logger;
client.db = new Database(mongourl);
client.apis = new APIs();
client.tools = new StringUtils();

// Register everything...
commandsHelper.registerAllCommands(__dirname + '/commands', client);
commandsHelper.registerAllEvents(__dirname + '/events', client);
playerEvents(client.player);

// Connect to DATABASE
Utilities.connectToDataBase(mongourl, client);
// ... and go!
client.login(token);
