const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRoleFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "dj",
  description: "Set DJ Role",
  args: true,
  usage: `dj set <role>`,
  async run(message, args, client, defaultPrefix) {
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
      const test = await getRoleFromMention(args[1], message);
    }
  },
  data: new SlashCommandBuilder()
    .setName("dj")
    .setDescription("Set DJ Role")
    .addStringOption((option) =>
      option.setName("role").setDescription("DJ Role").setRequired(true)
    ),
  async execute(interaction, client) {},
};
