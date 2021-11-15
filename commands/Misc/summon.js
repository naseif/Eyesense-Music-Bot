const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");
const { getGuildUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "summon",
  args: true,
  aliases: ["sum"],
  usage: "sum || summon <user>",
  description: "Summons the user to your voice channel",
  async run(message, args, client) {
    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("RED", `❌ | You have to mention a user to summon!`),
        ],
      });

    if (!message.member.permissions.has("MOVE_MEMBERS"))
      return await message.channel.send({
        embeds: [
          embedMessage("RED", `❌ | You have no permission to summon users!`),
        ],
      });

    const guildUser = getGuildUserFromMention(args[0], message);

    if (!guildUser)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | I could not resolve the user, please make sure to mention the user!`
          ),
        ],
      });

    if (!guildUser.voice.channelId)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | ${user.toString()} is not connected to any voice channel!`
          ),
        ],
      });

    try {
      await guildUser.voice.setChannel(message.member.voice.channelId);
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `User ${guildUser.toString()} has been moved to <#${
              message.member.voice.channelId
            }>`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      return await message.channel.send(
        `❌ | Something went wrong, I could not summon this user!`
      );
    }
  },
  data: new SlashCommandBuilder()
    .setName("summon")
    .setDescription("Summons the user to your voice channel")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to summon!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    if (!interaction.member.permissions.has([Permissions.FLAGS.MOVE_MEMBERS]))
      return await interaction.followUp({
        embeds: [
          embedMessage("RED", `❌ | You have no permission to summon users!`),
        ],
      });

    if (!user.voice.channelId)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | ${user.toString()} is not connected to any voice channel!`
          ),
        ],
      });

    try {
      await user.voice.setChannel(interaction.member.voice.channelId);
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `User ${user.toString()} has been moved to <#${
              interaction.member.voice.channelId
            }>`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      return await interaction.followUp(
        `Something went wrong, I could not summon this user!`
      );
    }
  },
};
