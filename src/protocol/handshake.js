const { readVarInt, writeVarInt } = require("../datatypes/varint");
const { writeString, readString } = require("../datatypes/string");
const NodeRSA = require("node-rsa");
const crypto = require("crypto");

module.exports = handshake;

function handshake(socket, payload) {
  console.log("handshake");
  const [protocol, a] = readVarInt(payload);
  const [address, b] = readString(a);
  const port = Buffer.from(b.slice(0, 2)).readInt16BE();
  const [nextState, c] = readVarInt(b.slice(2));

  console.log(protocol, address, port, nextState);

  const res = Buffer.concat([
    Buffer.from([0x00]),
    writeString(JSON.stringify(json)),
  ]);

  const resPacket = Buffer.concat([writeVarInt(res.length), res]);

  socket.write(resPacket);

  return nextState;
}

const serverId = "azertazertazertazert";

const json = {
  version: {
    name: "1.17.1",
    protocol: 756,
  },
  players: {
    max: 999,
    online: 0,
    sample: [],
  },
  description: {
    text: "Hello world !",
  },
};
