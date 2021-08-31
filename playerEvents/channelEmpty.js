const { embedMessage } = require("../modules/embedSimple");

module.exports = {
  name: "channelEmpty",
  async execute(queue) {
    try {
      setTimeout(async () => {
        if (queue) {
          await queue.metadata.followUp({
            embeds: [
              embedMessage(
                "#9dcc37",
                `✅ **${queue.metadata.client.user.username}** disconnected from [<#${queue.connection.channel.id}>] because channel was empty!`
              ),
            ],
          });
          queue.connection.disconnect();
        }
      }, 60 * 1000 * 3);
    } catch (err) {
      console.error(err.message);
    }
  },
};
