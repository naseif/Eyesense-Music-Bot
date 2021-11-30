const mdtable = require("mdtable");
const { writeFileSync } = require("fs");

/**
 * Creats a MD Table for github
 * @param {array} commands
 * @returns New File containng the commands table
 */

module.exports.commandsReadMe = (commands, category) => {
  const tableData = {
    header: ["Name", "Description", "Arguments"],
    alignment: ["L", "C", "C"],
    rows: [],
  };
  const tableSettings = {
    borders: true,
    padding: 1,
  };

  commands.map((command) => {
    if (command.name === undefined) return;
    if (command.category === category) {
      tableData.rows.push([
        `**${command?.name}**`,
        command?.description,
        command?.args ? command.args : "false",
      ]);
    }
  });

  const commandsTable = mdtable(tableData, tableSettings);

  writeFileSync("./Commands1.md", commandsTable, "utf-8");
};
