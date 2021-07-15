const { readVarInt } = require("./datatypes/varint");
const handshake = require("./protocol/handshake");

class Client {
  /**
   * @param {number} id
   * @param {Socket} socket
   */
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
  }

  register() {
    this.socket.on("data", (data) => {
      const [length, remain] = readVarInt(data);
      const [packetID, payload] = readVarInt(remain);

      switch (packetID) {
        case 0x00:
          handshake(payload, this.socket);
          break;
        default:
          console.warn(
            `Received a packet with ID ${packetID} which is currently not implemented !`
          );
      }
    });
  }
}

module.exports = Client;
