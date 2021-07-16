const dispatch = require("./dispatcher");
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
    this.verifyToken = null;
  }

  setState(newState) {
    this.state = newState;
  }

  register(server) {
    this.socket.on("data", (data) => {
      dispatch(this.socket, data, this, server);
    });
  }
}

module.exports = Client;
