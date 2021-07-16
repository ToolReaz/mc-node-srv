module.exports = ping;

function ping(payload, socket) {
  const res = Buffer.concat([Buffer.from([0x01]), payload]);
  const resSocket = Buffer.concat([Buffer.from([res.length]), res]);
  socket.write(resSocket);
}
