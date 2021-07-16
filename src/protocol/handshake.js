const { readVarInt, writeVarInt } = require("../datatypes/varint");
const { writeString, readString } = require("../datatypes/string");

module.exports = handshake;

function handshake(payload, socket) {
  const [protocol, a] = readVarInt(payload);
  const [address, b] = readString(a);
  const port = Buffer.from(b.slice(0, 2)).readInt16BE();
  const [state, c] = readVarInt(b.slice(2));

  //console.log(protocol, address, port, state);

  // STATUS
  if (state === 1) {
    const res = Buffer.concat([
      Buffer.from([0x00]),
      writeString(JSON.stringify(json)),
    ]);

    const resPacket = Buffer.concat([writeVarInt(res.length), res]);

    socket.write(resPacket);
    return;
  }

  // LOGIN
  if (state === 2) {
    const [username] = readString(c);
  }
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
