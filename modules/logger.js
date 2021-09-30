const moment = require("moment");
const chalk = require("chalk");

/**
 *
 * @param {string} message
 * @param {string} type
 * @returns
 */

module.exports.logger = (message, type = "log") => {
  const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;

  switch (type) {
    case "log":
      return console.log(
        `[${chalk.gray(date)}]: [${chalk.black.bgBlue(
          type.toUpperCase()
        )}] ${message}`
      );
    case "error":
      return console.log(
        `[${chalk.gray(date)}]: [${chalk.black.bgRed(
          type.toUpperCase()
        )}] ${message}`
      );
    default:
      throw new TypeError(
        "Logger type must be either warn, debug, log, ready, cmd or error."
      );
  }
};
