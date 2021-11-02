const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "stop",
  args: false,
  description: "Stops the player and leaves the voice channel",
  usage: "stop",
  async run(message, args, client) {
    const queue = client.player.getQueue(message.guild);

    if (!queue || !queue.playing) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | ${message.member.toString()}, Nothing is playing to stop!`
          ),
        ],
      });
    }
    const checkdj = await client.db.get(`djRole_${message.guildId}`);
    const userRoles = await message.member.roles.cache.map((role) => role.id);

    if (checkdj && !userRoles.includes(checkdj)) {
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
      if (queue && queue.playing) {
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Stopped **${queue.current.title}** in [${message.member.voice.channel}]`
            ),
          ],
        });
        await queue.stop();
      }
    } catch (err) {
      client.logger(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("#9dcc37", `❌ | Something went wrong :/`)],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the current song playing"),

  async execute(interaction, client) {
    const queue = client.player.getQueue(interaction.guild);
    await interaction.deferReply();

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | ${interaction.member.toString()}, Nothing is playing to stop!`
          ),
        ],
      });
    }

    const checkdj = await client.db.get(`djRole_${interaction.guildId}`);
    const userRoles = await interaction.member.roles.cache.map(
      (role) => role.id
    );

    if (checkdj && !userRoles.includes(checkdj)) {
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
      if (queue && queue.playing) {
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Stopped **${queue.current.title}** in [${interaction.member.voice.channel}]`
            ),
          ],
        });
        await queue.stop();
      }
    } catch (err) {
      client.logger(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("#9dcc37", `❌ | Something went wrong :/`)],
      });
    }
  },
};
