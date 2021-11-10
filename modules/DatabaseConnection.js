const mongoose = require("mongoose");

/**
 * Connects with the given DATABASE
 * @param {string} mongourl
 * @param {Client} client
 */
module.exports.connectDatabase = (mongourl, client) => {
  const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    connectTimeoutMS: 10000,
    family: 4,
    useUnifiedTopology: true,
  };
  mongoose.connect(mongourl, dbOptions);
  mongoose.Promise = global.Promise;
  mongoose.connection.on("connected", () => {
    client.logger("[DB] DATABASE CONNECTED");
  });
  mongoose.connection.on("err", (err) => {
    console.log(`Mongoose connection error: \n ${err.stack}`, "error");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
};
