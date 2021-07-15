module.exports = {
  readVarInt,
  writeVarInt,
  writeString,
};

/**
 * Read a buffer and return the decoded VarInt and the remaining bytes as a new buffer.
 * @param {Buffer} buffer
 * @returns
 */
function readVarInt(buffer) {
  let decodedInt = 0;
  let currentByte;
  let byteOffset = 0;
  let byteCount = 0;

  do {
    currentByte = buffer[byteCount];
    decodedInt |= (currentByte & 0b01111111) << byteOffset;

    if (byteOffset === 6) throw new Error("VarInt is too big");

    byteOffset += 7;
    byteCount++;
  } while ((currentByte & 0b10000000) != 0);

  const remainingBytes = Buffer.from(buffer.slice(byteCount));
  return [decodedInt, remainingBytes];
}

function writeVarInt(value) {
  let currentByte;
  let values = [];

  do {
    currentByte = value & 0b01111111;

    // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
    value >>>= 7;
    if (value != 0) currentByte |= 0b10000000;

    values.push(currentByte);
  } while (value != 0);

  return Buffer.from(values)
}

/**
 * Encode a string in a buffer
 * @param {String} string
 * @returns
 */
function writeString(string) {
  let stringBuffer = Buffer.from(string);
  return buffer;
}
