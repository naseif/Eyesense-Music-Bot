/**
 *  Chunks a single string into multiple multiple strings
 * @param {String} str
 * @param {Number} size
 * @returns Array containing the chunked strings
 */

module.exports.chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};
