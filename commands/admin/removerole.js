const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("removes a role for a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("role").setDescription("role name").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getMember("user");
    const roleName = interaction.options.getString("role");
    const roleToGive = interaction.guild.roles.cache.find(
      (role) => role.name === `${roleName}`
    );

    if (!roleToGive) return await interaction.followUp("No such role");
    if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Only server admins can remove roles from users!`
          ),
        ],
      });

    try {
      await user.roles.remove(roleToGive);
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | ${roleToGive} has been removed from ${user}`
          ),
        ],
      });
    } catch (err) {
      console.error(err);
      if (err.message === "Missing Access") {
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ I do not have adminstraitor permission!`
            ),
          ],
        });
      }
      if (err.message === "Missing Permissions") {
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ I can not remove this role from user since the role is above me!`
            ),
          ],
        });
      }
    }
  },
};
