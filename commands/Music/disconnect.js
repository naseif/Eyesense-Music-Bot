const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "disconnect",
  aliases: ["dc"],
  args: false,
  description: "disconnects the bot from the voice channel",
  usage: "dc || disconnect",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ I am not connected to a voice channel!`),
        ],
      });
    }

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ | You must be in my voice channel to disconnect me!`),
        ],
      });

    try {
      if (queue) {
        await queue.connection.disconnect();
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${client.user.username}** disconnected from [<#${message.member.voice.channelId}>]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            "Could not disconnect the bot, Maybe you do not have permission ?"
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("disconnects the bot from the voice channel"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ I am not connected to a voice channel!`),
        ],
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `❌ | You must be in my voice channel to disconnect me!`),
        ],
      });


    try {
      if (queue) {
        await queue.destroy(true);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${interaction.client.user.username}** disconnected from [<#${interaction.member.voice.channelId}>]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            "Could not disconnect the bot, Maybe you do not have permission ?"
          ),
        ],
      });
    }
  },
};
