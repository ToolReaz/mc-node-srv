const crypto = require("crypto");

module.exports = login;

let serverId;

function login(socket, payload, client, server) {
  console.log("login");
  const [username] = readString(payload);
  console.log(username + " try to connect...");

  serverId = crypto.randomBytes(4).toString("hex");
  client.verifyToken = crypto.randomBytes(4);

  let pubKeyFormated = "";
  server.rsaKey
    .exportKey("pkcs8-public-pem")
    .split("\n")
    .forEach((line) => {
      pubKeyFormated += line;
    });
  client.publicKey = Buffer.from(pubKeyFormated, "base64");

  // Help: https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/src/server/login.js
  // TODO: figure out if key length is number of key's bytes (1024) or the buffer's length
  const res = Buffer.from([
    0x01,
    writeString(serverId),
    writeVarInt(client.publicKey.length),
    client.publicKey,
    Buffer.from([client.verifyToken.length]),
    Buffer.from([client.verifyToken]),
  ]);

  const resSocket = Buffer.concat([Buffer.from([res.length]), res]);
  socket.write(resSocket);
}
