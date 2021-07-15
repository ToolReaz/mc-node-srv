const { readVarInt, writeVarInt } = require("../datatypes/varint");
const { writeString } = require("../datatypes/string");

module.exports = handshake;

function handshake(payload, socket) {
  const [protocol, remain] = readVarInt(payload);
  console.log("Protocol version: " + protocol);

  const res = Buffer.concat([
    Buffer.from([0x00]),
    writeString(JSON.stringify(json)),
  ]);

  const resPacket = Buffer.concat([writeVarInt(res.length), res]);

  socket.write(resPacket);
}

const json = {
  version: {
    name: "1.17.1",
    protocol: 756,
  },
  players: {
    max: 42,
    online: 0,
    sample: [],
  },
  description: {
    text: "Hello world !",
  },
};
