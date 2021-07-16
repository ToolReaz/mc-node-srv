const { readVarInt } = require("./datatypes/varint");
const handshake = require("./protocol/handshake");
const ping = require("./protocol/ping");
const states = require("./states");

class Client {
  /**
   * @param {number} id
   * @param {Socket} socket
   */
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.state = states.HANDSHAKING;
  }

  set state(state) {
    this.state = state;
  }

  register() {
    this.socket.on("data", (data) => {
      const [length, remain] = readVarInt(data);
      const [packetID, payload] = readVarInt(remain);

      handshake(packetID, payload, this.socket, this.state);

      /*
      switch (packetID) {
        case 0x00:
          handshake(payload, this.socket);
          break;
        case 0x01:
          handshake(payload, this.socket);
          break;
        default:
          console.warn(
            `Received a packet with ID ${packetID} which is currently not implemented !`
          );
      }
      */
    });
  }
}

module.exports = Client;
