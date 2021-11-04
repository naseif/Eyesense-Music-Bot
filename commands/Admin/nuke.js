const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const {
  getTextChannelFromMention,
} = require("../../modules/getUserFromMention");

module.exports = {
  name: "nuke",
  args: true,
  usage: "nuke || nuke <channel id or channel name>",
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
    let textChannelID = await getTextChannelFromMention(args[0]);
    console.log(textChannelID);
    try {
      const channel = message.guild.channels.cache.find(
        (channel) => channel.id === textChannelID
      );

      if (!channel) {
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ A text channel with this ID was not found!`
            ),
          ],
        });
      }
      const channelClone = await channel.clone();
      const nukeChannel = await channel.delete();
      await channelClone.setPosition(nukeChannel.rawPosition);
      const newCreatedChannel = message.guild.channels.cache.find(
        (channel) => channel.name === channelClone.name
      );
      await newCreatedChannel.send({
        content: "✅ | Channel has been nuked :D",
        files: ["https://c.tenor.com/Naz32m5Pp6YAAAAC/nuke.gif"],
      });
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Text Channel ` +
              "`" +
              `${channelClone.name}` +
              "`" +
              ` has been nuked!`
          ),
        ],
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
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("id of the channel")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const id = interaction.options.getString("id");

    if (!interaction.member.permissions.has("ADMINISTRATOR"))
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to nuke this channel.\nOnly Server Admins have the permission to perform this action`
          ),
        ],
      });

    if (!id) {
      try {
        const cloneChannel = await interaction.channel.clone();
        const deleteChannel = await interaction.channel.delete();
        await cloneChannel.setPosition(deleteChannel.rawPosition);
        const newChannel = interaction.guild.channels.cache.find(
          (channel) => channel.name === cloneChannel.name
        );
        return await newChannel.send({
          content: "✅ | Channel has been nuked :D",
          files: ["https://c.tenor.com/Naz32m5Pp6YAAAAC/nuke.gif"],
        });
      } catch (err) {
        client.logger(err.message, "error");
        return await interaction.followUp({
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
      const channel = interaction.guild.channels.cache.find(
        (channel) => channel.id === id || channel.name === id
      );

      if (!channel) {
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ A text channel with this ID was not found!`
            ),
          ],
        });
      }

      const channelClone = await channel.clone();
      const nukeChannel = await channel.delete();
      await channelClone.setPosition(nukeChannel.rawPosition);
      const newCreatedChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name === channelClone.name
      );
      await newCreatedChannel.send({
        content: "✅ | Channel has been nuked :D",
        files: ["https://c.tenor.com/Naz32m5Pp6YAAAAC/nuke.gif"],
      });
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Text Channel ` +
              "`" +
              `${channelClone.name}` +
              "`" +
              ` has been nuked!`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Could not nuke the Channel!\nError: ${err.message}`
          ),
        ],
      });
    }
  },
};
