const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
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
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `You do not have permission to change ${user.toString()} nickname!`
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
            embedMessage("#9dcc37", `Nickname has been successfully changed!`),
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
            embedMessage("#9dcc37", `Nickname has been successfully changed!`),
          ],
        });
      } catch (err) {
        if (err.message === "Missing Permissions") {
          return await interaction.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                ` ❌ I do not have permission to change your Nickname, maybe your role is higher than mine or perhaps you are the owner ?`
              ),
            ],
          });
        }
      }
    }
  },
};
