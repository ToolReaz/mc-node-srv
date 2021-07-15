const net = require("net");
const Client = require("./client");

class Server {
  constructor() {
    this._socketServer = null;
    this.clients = {};
  }

  listen(port = 25565, hostname = "0.0.0.0") {
    let nextId = 0;

    this._socketServer = net.createServer();

    this._socketServer.on("connection", (socket) => {
      const client = new Client(nextId, socket);
      this.clients[nextId] = client;
      client.register();
      nextId++;
    });

    this._socketServer.listen(port, hostname);
  }
}

module.exports = Server;
