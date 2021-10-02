const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { logger } = require("./modules/logger.js");
const { token, prefix } = require("./config.json");
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
client.precommands = new Collection();
client.logger = logger;

// All commands!
const allCommandsFolders = fs.readdirSync("./commands");

for (const folder of allCommandsFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.data.name, command);
    client.precommands.set(command.name, command);
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

playerEvents(client.player);

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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.precommands.get(commandName) ||
    client.precommands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    command.run(message, args, client, prefix);
  } catch (error) {
    client.logger(error.message, "error");
    embed.setDescription(
      "There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately."
    );
    return message.channel.send({ embeds: [embed] });
  }
});

client.login(token);
