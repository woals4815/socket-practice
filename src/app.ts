import express, { Router } from 'express';
import helmet from 'helmet';
import http from 'http';
import ws from 'ws';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.get('/hello', (req, res) => {
  console.log(req);
  res.json('hello');
});

app.use(cors());
const server = http.createServer(app);

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let i = 0;

io.on('connection', (socket) => {
  io.emit('user_enter', `User${++i}이 입장했습니다.`);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('user_enter', (msg) => {
    io.emit('user_enter', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
