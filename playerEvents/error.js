module.exports = {
  name: "error",
  async execute(queue, error) {
    console.log(`An error occured Here is the error message: ${error.message}`);
  },
};
