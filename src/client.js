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

  register() {
    this.socket.on("data", (data) => {
      const [length, remain] = readVarInt(data);
      const [packetID, payload] = readVarInt(remain);

      handshake(packetID, payload, this.socket, this.state);

      if (this.state === states.HANDSHAKING) {
        switch (packetID) {
          case 0x00:
            handshake(payload, this.socket);
            break;
          case 0x01:
            ping(payload, this.socket);
            break;
          default:
            console.warn("Unhandled packet ID !");
        }
      }

      if (this.state === states.LOGIN) {
        switch (packetID) {
          case 0x00:
            login(payload, this.socket);
            break;
          case 0x01:
            ping(payload, this.socket);
            break;
          default:
            console.warn("Unhandled packet ID !");
        }
      }



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
