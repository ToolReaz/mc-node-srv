const { readVarInt, writeVarInt } = require("../datatypes/varint");
const { writeString, readString } = require("../datatypes/string");
const NodeRSA = require("node-rsa");
const crypto = require("crypto");

module.exports = handshake;

let userState = null;

function handshake(packetID, payload, socket) {
  if (packetID === 0x00) {
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
      console.log(username + " try to connect...");

      userState = "login";

      const rsaKey = new NodeRSA({ b: 1024 });

      const verifyToken = crypto.randomBytes(4).toString("hex");

      let pubKeyFormated = "";
      rsaKey
        .exportKey("pkcs8-public-pem")
        .split("\n")
        .forEach((line) => {
          pubKeyFormated += line;
        });
      const pubKeyBuffer = Buffer.from(pubKeyFormated, "base64");

      // Help: https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/src/server/login.js
      // TODO: figure out if key length is number of key's bytes (1024) or the buffer's length
      const res = Buffer.from([
        0x01,
        writeString(serverId),
        writeVarInt(1024),
        pubKeyBuffer,
        Buffer.from([verifyToken.length]),
        Buffer.from([verifyToken]),
      ]);

      const resSocket = Buffer.concat([Buffer.from([res.length]), res]);
      socket.write(resSocket);
    }
  } else if (state === 0x01) {
    if (userState === "login") {
      const [sharedSecretLength, a] = readVarInt(payload)
      const sharedSecret = a.slice(0, sharedSecretLength)
      const [verifyTokenLength, b] = readVarInt(a.slice(sharedSecretLength))
      const verifyToken = b.slice(0, verifyTokenLength)
      
    } else {
      // Ping
      const res = Buffer.concat([Buffer.from([0x01]), payload]);
      const resSocket = Buffer.concat([Buffer.from([res.length]), res]);
      socket.write(resSocket);
    }
  }
}

const serverId = "azertazertazertazert";

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
