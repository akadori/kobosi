const path = require('path');
const http = require('node:http');

let sockets = [];
let closeServer;

const originalCreateServer = http.createServer;
http.createServer = (...args) => {
  const server = originalCreateServer(...args);
  server.on('connection', (socket) => {
    sockets.push(socket);
  });
  closeServer = server.close.bind(server);
  return server;
}

const serverPath = path.join(__dirname, '../test/server.js');

require(serverPath);

console.log(require.cache[serverPath]);

const restartServer = () => {
  console.log('Restarting server...');
  sockets.forEach((socket) => {
    socket.destroy();
  });
  sockets = [];
  closeServer();
  delete require.cache[serverPath];
  require(serverPath);
}

setInterval(restartServer, 1000);