const net = require("net");
const { readVarInt, writeString, writeVarInt } = require("./datatypes");

const server = net.createServer();

server.on("connection", (socket) => {
  socket.on("data", (data) => {
    console.log(data);

    const [length, remain] = readVarInt(data);

    const [packetId, payload] = readVarInt(remain);

    console.log(`Length: ${length} | packetId: ${packetId}`);

    if (packetId === 0x00) {
      if (length > 1) {
        console.log("handshake");

        const [protocol, remain] = readVarInt(payload);
        console.log("Protocol version: " + protocol);

        const res = Buffer.concat([
          Buffer.from([0x00]),
          writeString(JSON.stringify(json)),
        ]);

        const packet = Buffer.concat([writeVarInt(res.length), res]);

        socket.write(packet);
      }
    }

    console.log("------------");
  });
});

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

server.listen(25565, "0.0.0.0");
console.log("Server started !");
