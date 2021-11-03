const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "nuke",
  args: true,
  usage: "nuke || nuke <channel id>",
  description: "Deletes a text channel and recreates it with same permissions",
  async run(message, args, client) {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to nuke this channel.\nOnly Server Admins have the permission to perform this action`
          ),
        ],
      });

    if (!args[0]) {
      try {
        const cloneChannel = await message.channel.clone();
        const deleteChannel = await message.channel.delete();
        await cloneChannel.setPosition(deleteChannel.rawPosition);
        const newChannel = message.guild.channels.cache.find(
          (channel) => channel.name === cloneChannel.name
        );
        return await newChannel.send({
          content: "✅ | Channel has been nuked :D",
          files: ["https://c.tenor.com/Naz32m5Pp6YAAAAC/nuke.gif"],
        });
      } catch (err) {
        client.logger(err.message, "error");
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ | Could not nuke the Channel!\nError: ${err.message}`
            ),
          ],
        });
      }
    }

    try {
      const channel = message.guild.channels.cache.find(
        (channel) => channel.id === args[0]
      );
      const channelClone = await channel.clone();
      const nukeChannel = await channel.delete();
      await channelClone.setPosition(nukeChannel.rawPosition);
      const newCreatedChannel = message.guild.channels.cache.find(
        (channel) => channel.name === channelClone.name
      );
      return await newCreatedChannel.send({
        content: "✅ | Channel has been nuked :D",
        files: ["https://c.tenor.com/Naz32m5Pp6YAAAAC/nuke.gif"],
      });
    } catch (err) {
      client.logger(err.message, "error");
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Could not nuke the Channel!\nError: ${err.message}`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription(
      "Deletes a text channel and recreates it with same permissions"
    ),
  async execute(interaction, client) {},
};
