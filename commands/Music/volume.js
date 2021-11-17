const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "volume",
  args: true,
  aliases: ["vol"],
  description: "Change the bots volume",
  usage: "vol || volume <number>",
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
            `❌ | You must be in my voice channel to change the bot volume!`
          ),
        ],
      });

    if (!queue) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ | ${message.member.toString()}, There is no queue created for this server!`
          ),
        ],
      });
    }

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

    const volume = Number(args[0]);

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ Please provide the bot volume you wish to set!`
          ),
        ],
      });

    if (!volume)
      return await message.channel.send({
        embeds: [embedMessage("RED", `❌ Volume must be a valid number!`)],
      });

    try {
      if (volume < 0 || volume > 100)
        return await message.channel.send({
          embeds: [embedMessage("RED", `Volume must be between 1 and 100!`)],
        });

      queue.setVolume(volume);
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `✅ Bot volume has been set to ${volume}`),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `There was an error setting the bot volume!\nError: ${error.message}`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the bots volume")
    .addIntegerOption((option) =>
      option.setDescription("new volume").setName("volume").setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const volume = interaction.options.getInteger("volume");
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
            `❌ | You must be in my voice channel to change the volume!`
          ),
        ],
      });

    if (!queue) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ | ${interaction.member.toString()}, There is no queue created for this server!`
          ),
        ],
      });
    }

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

    if (typeof volume === "string")
      return await interaction.followUp({
        embeds: [embedMessage("RED", `❌ Volume must be a number!`)],
      });

    try {
      if (volume < 0 || volume > 100)
        return await interaction.followUp({
          embeds: [embedMessage("RED", `Volume must be between 1 and 100!`)],
        });

      queue.setVolume(volume);
      return await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `✅ Bot volume has been set to ${volume}`),
        ],
      });
    } catch (error) {
      client.logger(error.message, "error");
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `There was an error setting the bot volume!\nError: ${error.message}`
          ),
        ],
      });
    }
  },
};
