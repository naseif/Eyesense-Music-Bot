const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "loop",
  aliases: ["repeat"],
  args: false,
  description: "Repeats the current Song or Queue",
  usage: "loop || repeat <queue> || <off> || <auto>",
  async run(message, args, client, prefix) {
    const queue = client.player.getQueue(message.guild);
    const mode = args.join(" ");

    if (!queue || !queue.playing) {
      return await message.channel.send({
        embeds: [embedMessage("#9dcc37", `❌ | No music is being played!`)],
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
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    switch (mode) {
      case "off":
        await queue.setRepeatMode(Number(0));
        await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `✅ | Repeat Mode has been disabled`),
          ],
        });
        break;
      case "queue":
        await queue.setRepeatMode(Number(2));
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for the current queue!`
            ),
          ],
        });
        break;
      case "auto":
        await queue.setRepeatMode(Number(3));
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Autoplay Repeat Mode has been enabled!`
            ),
          ],
        });
        break;
      default:
        await queue.setRepeatMode(1);
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for **${queue.current}**`
            ),
          ],
        });
    }
  },
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("repeats the current song")
    .addStringOption((option) =>
      option
        .setName("modes")
        .setDescription("repeat modes - Can be queue or song")
        .setRequired(true)
        .addChoice("OFF", "0")
        .addChoice("TRACK", "1")
        .addChoice("QUEUE", "2")
        .addChoice("AUTOPLAY", "3")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const usermention = `<@${interaction.member.id}>`;
    const queue = client.player.getQueue(interaction.guild);
    const mode = interaction.options.getString("modes");

    if (!queue || !queue.playing) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `${usermention}, ❌ | No music is being played!`
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
            "#9dcc37",
            `You are not allowed to use this command.\n This command is only available for users with the DJ Role: <@&${checkdj}>`
          ),
        ],
      });
    }

    switch (mode) {
      case "0":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ | Repeat Mode has been disabled`),
          ],
        });
        break;
      case "1":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for **${queue.current}**`
            ),
          ],
        });

        break;
      case "2":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ | Repeat Mode has been enabled for the current queue!`
            ),
          ],
        });

        break;
      case "3":
        await queue.setRepeatMode(Number(mode));
        await interaction.followUp({
          embeds: [
            embedMessage("#9dcc37", `✅ | Autoplay mode has been enabled `),
          ],
        });
        break;
    }
  },
};
