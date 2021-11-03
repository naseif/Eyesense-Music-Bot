const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");
const { getGuildUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "nickname",
  aliases: ["nn"],
  args: true,
  description: "Changes your own nickname or other users",
  usage: "nn || nickname <new nickname> <user (optional)>",
  async run(message, args, client) {
    const guildUser = getGuildUserFromMention(args[1], message);

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage("#9dcc37", `❌ You did not give me any nickname`),
        ],
      });

    if (
      args[0] &&
      !args[1] &&
      message.member.permissions.has("MANAGE_NICKNAMES")
    ) {
      try {
        await message.member.setNickname(args[0]);
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Nickname has been successfully changed to ` +
                "`" +
                `${args[0]}` +
                "`"
            ),
          ],
        });
      } catch (error) {
        client.logger(error.message, "error");
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ Could not change your nickname, maybe you are the owner?\n Error: ${error.message}`
            ),
          ],
        });
      }
    }

    if (
      args[0] &&
      args[1] &&
      message.member.permissions.has("MANAGE_NICKNAMES")
    ) {
      if (!guildUser)
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ Could not find User, either he does not exist or you did not mention him`
            ),
          ],
        });
      try {
        await guildUser.setNickname(args[0]);
        await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Nickname has been successfully changed to ` +
                "`" +
                `${args[0]}` +
                "`"
            ),
          ],
        });
      } catch (err) {
        client.logger(err.message, "error");
        if (err.message === "Missing Permissions") {
          return await message.channel.send({
            embeds: [
              embedMessage(
                "#9dcc37",
                `❌ I do not have permission to change other member's nicknames who have the same role as me or higher!`
              ),
            ],
          });
        }
      }
    }
    if (
      args[0] &&
      args[1] &&
      !message.member.permissions.has("MANAGE_NICKNAMES")
    ) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to change ${user.toString()} nickname!`
          ),
        ],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Changes your own nickname or other user's")
    .addStringOption((option) =>
      option
        .setName("nick")
        .setDescription("The new nickname!")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to change their's nickname")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const user = interaction.options.getMember("user");
    const newNickname = interaction.options.getString("nick");

    if (
      user &&
      !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)
    ) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to change ${user.toString()} nickname!`
          ),
        ],
      });
    }

    if (
      user &&
      interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)
    ) {
      try {
        await user.setNickname(newNickname);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Nickname has been successfully changed!`
            ),
          ],
        });
      } catch (err) {
        if (err.message === "Missing Permissions") {
          return await interaction.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                `❌ I do not have permission to change other member's nicknames who have the same role as me or higher!`
              ),
            ],
          });
        }
      }
    }

    if (!user) {
      try {
        await interaction.member.setNickname(newNickname);
        await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ Nickname has been successfully changed!`
            ),
          ],
        });
      } catch (err) {
        client.logger(err.message, "error");
        if (err.message === "Missing Permissions") {
          return await interaction.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                ` ❌ I do not have permission to change your nickname!\n maybe your role is higher than mine or perhaps you are the owner ?`
              ),
            ],
          });
        }
      }
    }
  },
};
