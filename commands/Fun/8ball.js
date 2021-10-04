const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
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
