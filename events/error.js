const { logger } = require(".././modules/logger");

module.exports = {
  name: "error",
  async execute(error) {
    logger(error, "error");
  },
};
