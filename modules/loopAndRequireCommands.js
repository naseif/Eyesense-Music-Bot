const fs = require("fs");

module.exports.findAndRequire = (inputPath, extension, collection) => {
  const files = fs
    .readdirSync(inputPath)
    .filter((command) => command.endsWith(extension));

  for (const f of files) {
    const command = require(`../${inputPath}/${f}`);
    collection.set(command.data.name, command);
  }
};
