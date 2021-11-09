const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "skip",
  args: false,
  description: "Skips to the next song in the Queue",
  aliases: ["s"],
  usage: "s || skip",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

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

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You must be in my voice channel to skip the current song!`
          ),
        ],
      });

    if (!queue || !queue.playing)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No music is being played! [${message.member.toString()}]`
          ),
        ],
      });

    try {
      const currnetSong = queue.current;
      await queue.skip();
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Skipped **${currnetSong.title}** [${message.member.toString()}]`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", "❌ Song could not be skipped")],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips a song from the queue"),

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
            "#9dcc37",
            `❌ | You must be in my voice channel to skip the current song!`
          ),
        ],
      });

    if (!queue || !queue.playing)
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | No music is being played! [${interaction.member.toString()}]`
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
      const currnetSong = queue.current;
      await queue.skip();
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Skipped **${
              currnetSong.title
            }**, [${interaction.member.toString()}]`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", "❌ Song could not be skipped")],
      });
    }
  },
};
