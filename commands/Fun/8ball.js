const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  name: "8ball",
  args: true,
  aliases: ["8"],
  usage: "8ball <question>",
  description: "Ask the magic ball a question!",
  async run(message, args) {
    const question = args.join(" ");

    if (!question)
      return await message.channel.send({
        embeds: [embedMessage("9dcc37", `You did not ask me anything!`)],
      });

    const answers = [
      "Aboslutely 👌",
      "I am not sure, but maybe? 🤐",
      "Yes! 💯",
      "No! 😡",
      "Uhh, yeah sure 😕",
      "Mhmm, why not 🤷‍♂️",
      "Hell no! 🤫",
      "I won't answer that 🤥",
      "That's a bit lewd 🤤",
    ];

    const embed = {
      color: "#9dcc37",
      title: `${question}`,
      author: {
        name: `${message.member.user.username}`,
        icon_url: `${
          message.member.user.avatarURL() || client.user.avatarURL()
        }`,
      },
      description: `${answers[Math.floor(Math.random() * answers.length)]}`,
    };
    await message.channel.send({
      embeds: [embed],
    });
  },
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("ask the magic ball a question!")
    .addStringOption((option) =>
      option.setName("ques").setDescription("question").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const question = interaction.options.getString("ques");

    const answers = [
      "Aboslutely 👌",
      "I am not sure, but maybe? 🤐",
      "Yes! 💯",
      "No! 😡",
      "Uhh, yeah sure 😕",
      "Mhmm, why not 🤷‍♂️",
      "Hell no! 🤫",
      "I won't answer that 🤥",
      "That's a bit lewd 🤤",
    ];

    const embed = {
      color: "#9dcc37",
      title: `${question}`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
      description: `${answers[Math.floor(Math.random() * answers.length)]}`,
    };
    await interaction.followUp({
      embeds: [embed],
    });
  },
};
