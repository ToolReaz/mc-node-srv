const { writeVarInt, readVarInt } = require("./varint");

module.exports = {
  writeString,
  readString,
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

/**
 * Decode a string in a buffer
 * @param {Buffer} string
 * @returns
 */
function readString(buffer) {
  const [length, stringBuffer] = readVarInt(buffer);
  const string = stringBuffer.slice(0, length).toString("utf-8");
  const remain = Buffer.from(stringBuffer.slice(length));

  return [string, remain];
}
