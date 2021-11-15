const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const { prefix } = require("../../config.json");

module.exports = {
  name: "prefix",
  aliases: ["setup"],
  description: "set custom prefix for your server",
  args: true,
  usage: `prefix || setup <new prefix>`,
  async run(message, args, client, defaultPrefix) {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You do not have permission to change the prefix!`
          ),
        ],
      });

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("RED", `❌ You did not provide your new prefix!`),
        ],
      });

    if (args[1])
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ Prefix can't have 2 arguments`)],
      });

    if (args.join(" ") === prefix) {
      await client.db.delete(`guild_prefix_${message.guildId}`);
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Bot Prefix Resetted to ` +
              "`" +
              `${prefix}` +
              "`" +
              ` for ${message.guild.name}`
          ),
        ],
      });
    }

    try {
      await client.db.set(`guild_prefix_${message.guildId}`, args[0]);
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Bot Prefix set to ` +
              "`" +
              `${args[0]}` +
              "`" +
              ` for ${message.guild.name}`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ There has been an error, Could not set the new Prefix`
          ),
        ],
      });
    }
  },

  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("set custom prefix for your server")
    .addStringOption((option) =>
      option
        .setName("newprefix")
        .setDescription("Your new Prefix")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const newPrefix = interaction.options.getString("newprefix");
    await interaction.deferReply();

    if (!interaction.member.permissions.has("MANAGE_GUILD")) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `You do not have permission to change the prefix`
          ),
        ],
      });
    }

    if (newPrefix === prefix) {
      await client.db.delete(`guild_prefix_${interaction.guildId}`);
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Bot Prefix Resetted to ` + "`" + `${prefix}` + "`"
          ),
        ],
      });
    }

    try {
      await client.db.set(`guild_prefix_${interaction.guildId}`, newPrefix);
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ Bot Prefix set to ` + "`" + `${newPrefix}` + "`"
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ There has been an error, Could not set the new Prefix`
          ),
        ],
      });
    }
  },
};
