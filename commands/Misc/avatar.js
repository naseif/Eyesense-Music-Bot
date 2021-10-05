const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUserFromMention } = require("../../modules/getUserFromMention");

module.exports = {
  name: "avatar",
  args: true,
  description: "Sends the user's avatar or a mentioned users avatar",
  usage: "avatar <user (optional)>",
  async run(message, args, client) {
    const user = getUserFromMention(args[0], client) || message.member.user;

    if (!user.avatarURL())
      return await message.channel.send("This user has no avatar!");

    const embed = {
      color: "#9dcc37",
      fields: [
        {
          name: "User Avatar For: ",
          value: `${user}`,
          inline: true,
        },
      ],
      image: {
        url: `${user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })}`,
      },
      timestamp: new Date(),
    };

    await message.channel.send({ embeds: [embed] });
  },
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Sends the user's avatar")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");

    if (!user.avatarURL())
      return await interaction.followUp(`This user has no avatar!`);

    const embed = {
      color: "#9dcc37",
      fields: [
        {
          name: "User Avatar For: ",
          value: `${user}`,
          inline: true,
        },
      ],
      image: {
        url: `${user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })}`,
      },
      timestamp: new Date(),
    };

    await interaction.followUp({ embeds: [embed] });
  },
};
