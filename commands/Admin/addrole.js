const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { embedMessage } = require("../../modules/embedSimple");
const { getGuildUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "addrole",
  args: true,
  description: "Ddds a role for a user",
  usage: "addrole <user> <role name>",
  async run(message, args, client) {
    const guildUser = getGuildUserFromMention(args[0], message);
    const roleName = args[1];
    const roleToGive = message.guild.roles.cache.find(
      (role) => role.name === `${roleName}`
    );

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Please mention a user to grant the role!`
          ),
        ],
      });

    if (!roleName)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | Please enter the role name you wish to grant`
          ),
        ],
      });

    if (!roleToGive)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | I did not find this role, please make sure to enter a valid role name! (case sensitive)`
          ),
        ],
      });

    if (
      !message.member.permissions.has("ADMINISTRATOR") ||
      !message.member.permissions.has("MANAGE_ROLES")
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ | You do not have permission to grant roles!`
          ),
        ],
      });

    try {
      await guildUser.roles.add(roleToGive);
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | ${guildUser} has been given ${roleToGive} Role!`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
      if (err.message === "Missing Access") {
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ I do not have adminstraitor permission!`
            ),
          ],
        });
      }
      if (err.message === "Missing Permissions") {
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `❌ I can not add this role to the user!\nEtiher its above me or I have no right to assign it to other users!`
            ),
          ],
        });
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("adds a role for a user")
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
            `❌ | Only server admins can add roles to users!`
          ),
        ],
      });

    try {
      await user.roles.add(roleToGive);
      await interaction.followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ | ${user} has been given ${roleToGive} Role!`
          ),
        ],
      });
    } catch (err) {
      client.logger(err.message, "error");
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
              `❌ I can not add this role to the user!\nEtiher its above me or I have no right to assign it to other users!`
            ),
          ],
        });
      }
    }
  },
};
