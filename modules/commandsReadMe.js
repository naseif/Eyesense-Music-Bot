const mdtable = require("mdtable");
const {  writeFileSync } = require("fs");
module.exports.commandsReadMe = (commands) => {

  const tableData = {
    header: ["Name", "Description"],
    alignment: ["L", "C"],
    rows: [],
  };
  const tableSettings = {
    borders: true,
    padding: 1,
  };

  commands.map(command => {
    tableData.rows.push([`**/${command.data.name}**`, command.data.description])
  })

  const commandsTable = mdtable(tableData, tableSettings)

  writeFileSync("./Commands.md", commandsTable, "utf-8");
};
