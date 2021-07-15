module.exports = {
  writeString,
};

/**
 * Encode a string in a buffer
 * @param {String} string
 * @returns
 */
function writeString(string) {
  let stringBuffer = Buffer.from(string, "utf-8");
  let lengthBuffer = writeVarInt(stringBuffer.length);

  return Buffer.concat([lengthBuffer, stringBuffer]);
}
