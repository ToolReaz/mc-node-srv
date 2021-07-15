const net = require("net");
const { readVarInt } = require("./datatypes");

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

        const [protocol, remain] = readVarInt(payload)
        console.log("Protocol version: " + protocol)

        const res = Buffer.from([0x00, json]);
        const res2 = Buffer.concat([Buffer.from([res.length]), res]);
        socket.write(res2);
      }
    }

    console.log("------------");
  });
});

const json = {
  version: {
    name: "1.17.1",
    protocol: 755,
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
