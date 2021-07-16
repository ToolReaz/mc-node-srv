const { readVarInt } = require("./datatypes/varint");
const handshake = require("./protocol/handshake");
const login = require("./protocol/login");
const ping = require("./protocol/ping");
const states = require("./states");

module.exports = dispatch;

function dispatch(socket, packet, client, server) {
  const [packetLength, packetData] = readVarInt(packet);
  const [packetID, payload] = readVarInt(packetData);

  console.log(`Recieved packet id ${packetID} with state ${client.state}`);

  if (client.state === states.HANDSHAKING) {
    if (packetID === 0x00) {
      const nextState = handshake(socket, payload);

      if (nextState === 1) {
        client.setState(states.STATUS);
      } else if (nextState === 2) {
        client.setState(states.LOGIN);
      }

      return;
    }
  }

  if (client.state === states.STATUS) {
    if (packetID === 0x01) {
      ping(socket, payload);
      return;
    }
  }

  if (this.state === states.LOGIN) {
    if (packetID === 0x00) {
      login(this.socket, payload, client, server);
      return;
    }
    if (packetID === 0x01) {
      login(this.socket, payload, client, server);
      return;
    }
  }
}
