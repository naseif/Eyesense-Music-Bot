const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedMessage } = require("../../modules/embedSimple");
const {
  getTextChannelFromMention,
} = require("../../modules/getUserFromMention");

module.exports = {
  name: "welcome",
  description: "Sets a custom welcome channel instead of the default channel!",
  args: true,
  usage: `welcome add <channel name || channel mention || channel id> || welcome remove <channel name || channel mention || channel id>`,
  async run(message, args, client, defaultPrefix) {
    if (
      !message.member.permissions.has("MANAGE_GUILD") ||
      !message.member.permissions.has("ADMINISTRATOR")
    )
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You do not have permission to set a custom welcome channel!`
          ),
        ],
      });

    if (!args[0])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You did not provide enough arguments!\n See \`${defaultPrefix}h welcome\` for more info!`
          ),
        ],
      });

    const options = ["add", "remove"];
    if (!options.includes(args[0]) && args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ This is not a valid operation.\n Please specify whether you want to \`add || remove\` a custom weclome channel!`
          ),
        ],
      });

    if (options.includes(args[0]) && !args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ You netiher mentioned the text channel nor its name!`
          ),
        ],
      });

    if (!options.includes(args[0]) && !args[1])
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ This is not a valid operation. See \`${defaultPrefix}h welcome\` for more info \n Please specify whether you want to \`add || remove\` a custom weclome channel!`
          ),
        ],
      });

    const newCustomChannel =
      getTextChannelFromMention(args[1]) ||
      message.guild.channels.cache.find(
        (channel) => channel.name === args[1] || channel.id === args[1]
      );

    if (!newCustomChannel)
      return await message.channel.send({
        embeds: [
          embedMessage(
            "RED",
            `❌ No text channel with this name or mention was found!`
          ),
        ],
      });

    try {
      switch (args[0]) {
        case "add":
          await client.db.set(
            `welcome_${message.guildId}`,
            `${newCustomChannel.id ? newCustomChannel.id : newCustomChannel}`
          );
          await message.channel.send({
            embeds: [
              embedMessage(
                "#9dcc37",
                `✅ A custom welcome message has been set successfully!`
              ),
            ],
          });
          break;
        case "remove":
          const savedChannel = await client.db.get(
            `welcome_${message.guildId}`
          );
          if (!savedChannel)
            return await message.channel.send({
              embeds: [
                embedMessage(
                  "RED",
                  `❌ There is no configured welcome channel for this server!`
                ),
              ],
            });

          let providedChannel =
            getTextChannelFromMention(args[1]) ||
            message.guild.channels.cache.find(
              (channel) => channel.name === args[1] || channel.id === args[1]
            );

          providedChannel.id
            ? (providedChannel = providedChannel.id)
            : (providedChannel = providedChannel);

          if (savedChannel !== providedChannel)
            return await message.channel.send({
              embeds: [
                embedMessage(
                  "RED",
                  `❌ This is not the channel I have in my database!\nConfigured welcome channel: <#${savedChannel}>`
                ),
              ],
            });

          await client.db.delete(`welcome_${message.guildId}`);
          await message.channel.send({
            embeds: [
              embedMessage(
                "#9dcc37",
                `✅ Welcome message channel has been resetted to default!`
              ),
            ],
          });
          break;
      }
    } catch (err) {
      client.logger.error(err.message, "error");
      await message.channel.send({
        embeds: [embedMessage("RED", `Could not perform this action`)],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription(
      "Sets a custom welcome channel instead of the default channel!"
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("add or delete custom welcome channel")
        .addChoice("Add", "add")
        .addChoice("Remove", "remove")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("New text channel")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const action = interaction.options.getString("action");
    const newwelcomeChannel = interaction.options.getChannel("channel");

    if (
      !interaction.member.permissions.has("MANAGE_GUILD") ||
      !interaction.member.permissions.has("ADMINISTRATOR")
    ) {
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ You do not have permission to set a custom welcome channel!`
          ),
        ],
      });
    }

    if (newwelcomeChannel.type !== "GUILD_TEXT")
      return await interaction.followUp({
        embeds: [
          embedMessage(
            "RED",
            `❌ You can only set text channels as custom welcome message channel!`
          ),
        ],
      });

    try {
      switch (action) {
        case "add":
          await client.db.set(
            `welcome_${interaction.guildId}`,
            `${newwelcomeChannel.id}`
          );
          await interaction.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                `✅ A custom welcome message has been set successfully!`
              ),
            ],
          });
          break;
        case "remove":
          const savedChannel = await client.db.get(
            `welcome_${interaction.guildId}`
          );
          if (!savedChannel)
            return await interaction.followUp({
              embeds: [
                embedMessage(
                  "RED",
                  `❌ There is no configured welcome channel for this server!`
                ),
              ],
            });

          let providedChannel =
            getTextChannelFromMention(args[1]) ||
            interaction.guild.channels.cache.find(
              (channel) => channel.name === args[1] || channel.id === args[1]
            );

          providedChannel.id
            ? (providedChannel = providedChannel.id)
            : (providedChannel = providedChannel);

          if (savedChannel !== providedChannel)
            return await interaction.followUp({
              embeds: [
                embedMessage(
                  "RED",
                  `❌ This is not the channel I have in my database!\nConfigured welcome channel: <#${savedChannel}>`
                ),
              ],
            });
          await client.db.delete(`welcome_${interaction.guildId}`);
          await interaction.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                `✅ Welcome message channel has been resetted to default!`
              ),
            ],
          });
          break;
      }
    } catch (err) {
      client.logger.error(err.message, "error");
      await interaction.followUp({
        embeds: [embedMessage("RED", `❌ Could not perform this action`)],
      });
    }
  },
};
