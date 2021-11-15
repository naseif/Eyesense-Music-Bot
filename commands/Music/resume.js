const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "resume",
  args: false,
  description: "Resumes a paused song",
  aliases: ["r"],
  usage: "r || resume",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You must be in my voice channel to resume the current song!`
          ),
        ],
      });

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage("RED", `❌ | There is nothing playing to resume!`),
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
            "RED",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    try {
      if (queue) {
        await queue.setPaused(false);
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${
                queue.current.title
              }** resumed [${message.member.toString()}]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("RED", "❌ I was not able to resume this song")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes a paused song"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild);

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | You must be in my voice channel to resume the current song!`
          ),
        ],
      });

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage("RED", `❌ | There is nothing playing to resume!`),
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
            "RED",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    try {
      if (queue) {
        await queue.setPaused(false);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ **${
                queue.current.title
              }** resumed [${interaction.member.toString()}]`
            ),
          ],
        });
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("RED", "❌ I was not able to resume this song")],
      });
    }
  },
};
