const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const {
  getTextChannelFromMention,
} = require("../../modules/getUserFromMention");

module.exports = {
  name: "welcome",
  description: "Sets a custom welcome channel instead of the default channel!",
  args: true,
  usage: `welcome add <channel name || channel mention> || welcome remove <channel name || channel mention>`,
  async run(message, args, client, defaultPrefix) {
    if (
      !message.member.permissions.has("MANAGE_GUILD") ||
      !message.member.permissions.has("ADMINISTRATOR")
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You do not have permission to set a custom welcome channel!`
          ),
        ],
      });

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `You did not provide enough arguments!\n See \`${defaultPrefix}h welcome\` for more info!`
          ),
        ],
      });

    const options = ["add", "remove"];
    if (!options.includes(args[0]) && args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `This is not a valid operation.\n Please specify whether you want to \`add || remove\` a custom weclome channel!`
          ),
        ],
      });

    if (options.includes(args[0]) && !args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `You netiher mentioned the text channel nor its name!`
          ),
        ],
      });

    if (!options.includes(args[0]) && !args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `This is not a valid operation. See \`${defaultPrefix}h welcome\` for more info \n Please specify whether you want to \`add || remove\` a custom weclome channel!`
          ),
        ],
      });

    const newCustomChannel =
      getTextChannelFromMention(args[1]) ||
      message.guild.channels.cache.find((channel) => channel.name === args[1]);

    if (!newCustomChannel)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `No text channel with this name or mention was found!`
          ),
        ],
      });

    try {
      switch (args[0]) {
        case "add":
          await client.db.set(
            `welcome_${message.guildId}`,
            `${newCustomChannel.id ? newCustomChannel.id : newCustomChannel}`
          );
          await message.channel.send({
            embeds: [
              embedMessage(
                "#9dcc37",
                `A custom welcome message has been set successfully!`
              ),
            ],
          });
          break;
        case "remove":
          await client.db.delete(`welcome_${message.guildId}`);
          await message.channel.send({
            embeds: [
              embedMessage(
                "#9dcc37",
                `Welcome message channel has been resetted to default!`
              ),
            ],
          });
          break;
      }
    } catch (err) {
      client.logger.error(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("RED", `Could not perform this action`)],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription(
      "Sets a custom welcome channel instead of the default channel!"
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("add or delete custom welcome channel")
        .addChoice("Add", "set")
        .addChoice("Remove", "delete")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("New text channel")
        .setRequired(true)
    ),
  async execute(interaction, client) {},
};
