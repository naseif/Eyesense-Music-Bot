const { SlashCommandBuilder } = require("@discordjs/builders");

function printHelpByCollection(collection, category) {
  const commands = collection
    .filter((item) => item.category === category || category === null)
    .map((command) => {
      return (
        "`" +
        `${command.data.name || command.name} :` +
        "`" +
        " " +
        `${command.data.description || command.description}, `
      );
    });
  return commands || null;
}

module.exports = {
  name: "help",
  category: "Misc",
  args: true,
  aliases: ["h"],
  description: "Return all commands, or one specific command",
  usage: "h <category> <command>, both are optional",
  async run(message, args, client, prefix) {
    const listCategories = (collection) => {
      return collection.map((command) => "`" + command.category + "`");
    };

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const searchCommand = args.join(" ");
    const categories = listCategories(client.commands).filter(onlyUnique);

    if (!searchCommand) {
      const embed = {
        color: "#9dcc37",
        title: `${client.user.username}'s Categories!`,
        description:
          `These are my command categories ${categories.join(
            ", "
          )}. To get more Information about each category, use ` +
          "`" +
          `${prefix}help <category> || <command>` +
          "`",
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.member.user.username}`,
          icon_url: `${message.member.user.avatarURL()}`,
        },
      };
      return await message.channel.send({ embeds: [embed] });
    }

    if (searchCommand) {
      const command =
        client.commands.get(searchCommand) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(searchCommand)
        );

      if (categories.includes("`" + searchCommand + "`")) {
        const commandsperCategory = printHelpByCollection(
          client.commands,
          searchCommand
        );
        if (!commandsperCategory)
          return await message.channel.send(
            `Category does not exist. Make sure to write the category name as it is`
          );
        const embed = {
          color: "#9dcc37",
          title: `${client.user.username}'s ${searchCommand} Commands!`,
          description: `${commandsperCategory.join("\n")}`,
          timestamp: new Date(),
          footer: {
            text: `Requested by ${message.member.user.username}`,
            icon_url: `${message.member.user.avatarURL()}`,
          },
        };
        return await message.channel.send({ embeds: [embed] });
      }

      if (!command && !categories.includes("`" + searchCommand + "`")) {
        return await message.channel.send(
          "What you provided is neither a command nor a category"
        );
      }

      if (!categories.includes("`" + searchCommand + "`")) {
        const embed = {
          color: "#9dcc37",
          fields: [
            {
              name: "Command",
              value: "`" + `${command.name}` + "`",
              inline: true,
            },
            {
              name: "Aliases",
              value:
                "`" +
                `${command.aliases ? command?.aliases.join(", ") : "None"}` +
                "`",
              inline: true,
            },
            {
              name: "Requires arguments?",
              value: `${command?.args ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Category",
              value: `${command.category}`,
              inline: true,
            },
            {
              name: "Description",
              value: `${command.description}`,
              inline: true,
            },
            {
              name: "Usage",
              value: "`" + `${prefix}${command?.usage}` + "`",
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `Requested by ${message.member.user.username}`,
            icon_url: `${message.member.user.avatarURL()}`,
          },
        };

        return await message.channel.send({ embeds: [embed] });
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands for this bot!")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("show help by category")
        .addChoice("Admin", "admin")
        .addChoice("Anime", "anime")
        .addChoice("Fun", "fun")
        .addChoice("Music", "music")
        .addChoice("Misc", "misc")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const category = interaction.options.getString("category");

    let help;
    help = printHelpByCollection(client.commands, category);

    const embed = {
      color: "#9dcc37",
      title: `${client.user.username}'s Commands!`,
      description: `${help.join("\n")}`,
      timestamp: new Date(),
      footer: {
        text: `Requested by ${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
      },
    };

    await interaction.followUp({ embeds: [embed] });
  },
};
