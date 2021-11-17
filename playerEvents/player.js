const { embedMessage } = require("../modules/embedSimple");
const { logger } = require("../modules/logger");

module.exports.playerEvents = (player) => {
  player.on("error", (queue, error) => {
    logger(`${queue.guild.name} An Error has occurred ${error}`, "error");
  });
  player.on("botDisconnect", (queue) => {
    logger(`${queue.guild.name} Disconnected from Channel`);
  });
  player.on("channelEmpty", async (queue) => {
    logger(
      `${queue.guild.name}: Voice channel is empty right now!, leaving the Channel`
    );
    await queue.metadata.channel.channel.send({
      embeds: [
        embedMessage(
          "9dcc37",
          `Leaving ${queue.metadata.channel.guild.me.voice.channel.toString()} since its empty 🙄\nconsider using the 247 command to prevent this behaviour 😎`
        ),
      ],
    });
  });
  player.on("connectionCreate", (queue, connection) => {
    logger(
      `${queue.guild.name}: Bot has successfully connected to Voice Channel!`
    );
  });
  player.on("connectionError", (queue, error) => {
    logger(
      `${queue.guild.name}: There has been a connection error, ${error.message}`
    );
  });
  player.on("queueEnd", (queue) => {
    logger(`${queue.guild.name}: Queue has finished playing!`);
  });
  player.on("trackAdd", (queue, track) => {
    logger(`${queue.guild.name}: ${track.title} has been added!`);
  });
  player.on("trackEnd", (queue, track) => {
    logger(`${queue.guild.name}: ${track.title} has finished playing!`);
  });
  player.on("tracksAdd", (queue, tracks) => {
    logger(
      `${queue.guild.name}: A playlist with ${tracks.length} songs has beed added!`
    );
  });
  player.on("trackStart", (queue, track) => {
    logger(`${queue.guild.name}: ${track.title} has started playing`);
  });
};
