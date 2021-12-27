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
          embedMessage("RED", `❌ I am not connected to a voice channel!`),
        ],
      });
    }

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You must be in my voice channel to disconnect me!`
          ),
        ],
      });

    const checkdj = await client.db.get(`djRole_${message.guildId}`);
    const userRoles = await message.member.roles.cache.map((role) => role.id);

    if (
      checkdj &&
      !userRoles.includes(checkdj) &&
      message.guild.ownerId !== message.author.id
    ) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    try {
      if (queue) {
        await queue.destroy(true);
        return await message.channel.send({
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
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            "❌ Could not disconnect the bot, Maybe you do not have permission ?"
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
          embedMessage("RED", `❌ I am not connected to a voice channel!`),
        ],
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You must be in my voice channel to disconnect me!`
          ),
        ],
      });

    const checkdj = await client.db.get(`djRole_${interaction.guildId}`);
    const userRoles = await interaction.member.roles.cache.map(
      (role) => role.id
    );

    if (
      checkdj &&
      !userRoles.includes(checkdj) &&
      interaction.guild.ownerId !== interaction.member.id
    ) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

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
            "RED",
            "❌ Could not disconnect the bot, Maybe you do not have permission ?"
          ),
        ],
      });
    }
  },
};
