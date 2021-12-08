const { Utils } = require("devtools-ts");

module.exports = {
  name: "error",
  async execute(error) {
    new Utils().logger(error, "error");
  },
};
