const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRoleFromMention } = require("../../modules/getUserFromMention");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "dj",
  description: "Set DJ Role",
  args: true,
  usage: `dj set || delete <role>`,
  async run(message, args, client, defaultPrefix) {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to grant the DJ Role!`
          ),
        ],
      });

    if (!args[0]) {
      return await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `Please choose whether you want to set or delete an existing role`
          ),
        ],
      });
    }

    if (args[0] === "set" && args[1]) {
      const newDjRole = await getRoleFromMention(args[1], message);
      if (!newDjRole)
        return await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `The Role you mentioned is not valid!`),
          ],
        });

      await client.db.set(`djRole_${message.guildId}`, newDjRole.id);
      await message.channel.send({
        embeds: [
          embedMessage(
            "#9dcc37",
            `✅ DJ Role has been set <@&${newDjRole.id}>`
          ),
        ],
      });
    }
    if (args[0] === "delete" && args[1]) {
      const roleToDelete = await getRoleFromMention(args[1], message);
      const roleExist = await client.db.get(`djRole_${message.guildId}`);
      if (!roleToDelete)
        return await message.channel.send({
          embeds: [
            embedMessage("#9dcc37", `The Role you mentioned is not valid!`),
          ],
        });
      if (roleToDelete.id === roleExist) {
        await client.db.delete(`djRole_${message.guildId}`, roleToDelete.id);
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ DJ Role has been deleted <@&${roleToDelete.id}>`
            ),
          ],
        });
      }
      if (roleToDelete.id !== roleExist) {
        return await message.channel.send({
          embeds: [
            embedMessage(
              "#9dcc37",
              `The Role you wish to delete is not registered as DJ Role\nRegistered Role: <@&${roleExist}>`
            ),
          ],
        });
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName("dj")
    .setDescription("Set DJ Role")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("add or delete dj role")
        .addChoice("Add", "set")
        .addChoice("Remove", "delete")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("dj").setDescription("DJ Role").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const role = interaction.options.getRole("dj");
    const action = interaction.options.getString("action");

    if (!interaction.member.permissions.has("MANAGE_GUILD"))
      return await followUp({
        embeds: [
          embedMessage(
            "#9dcc37",
            `❌ You do not have permission to grant the DJ Role!`
          ),
        ],
      });

    if (action === "set") {
      await client.db.set(`djRole_${interaction.guildId}`, role.id);
      await interaction.followUp({
        embeds: [
          embedMessage("#9dcc37", `✅ DJ Role has been set <@&${role.id}>`),
        ],
      });
    }

    if (action === "delete") {
      const roleExist = await client.db.get(`djRole_${interaction.guildId}`);
      if (!roleExist)
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `There is no registered DJ Role for this server`
            ),
          ],
        });
      if (role.id === roleExist) {
        await client.db.delete(`djRole_${interaction.guildId}`, role.id);
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `✅ DJ Role has been deleted <@&${role.id}>`
            ),
          ],
        });
      }
      if (role.id !== roleExist) {
        return await interaction.followUp({
          embeds: [
            embedMessage(
              "#9dcc37",
              `The Role you wish to delete is not registered as DJ Role\nRegistered Role: <@&${roleExist}>`
            ),
          ],
        });
      }
    }
  },
};
