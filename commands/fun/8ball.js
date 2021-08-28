const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("ask the magic ball a question!")
    .addStringOption((option) =>
      option.setName("ques").setDescription("question").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
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

    await interaction.followUp({
      embeds: [
        embedMessage(
          "#9dcc37",
          `${answers[Math.floor(Math.random() * answers.length)]}`
        ),
      ],
    });
  },
};
