import { Application } from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { Server, Socket } from 'socket.io';
import { handleSocketAuth } from './middlewares/handleSocketAuth';
import { GameService } from './classes/GameService';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '.env');
  dotenv.config({ path: pathToEnv });
}
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

const useWebSockets = (app: Application) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: CLIENT_BASE_URL,
      credentials: true,
    },
  });

  io.use(handleSocketAuth);
  const gameService = GameService.getInstance(io);

  io.on('connection', (socket: Socket) => {
    const username = socket.user?.username || socket.guest?.username;
    const id = socket.user?._id || socket.guest?.id;

    socket.emit('connected', {
      id,
      username,
    });

    console.log(`${id} connected: ${username}`);

    gameService.registerEventHandlers(socket);

    socket.on('disconnect', () => {
      console.log(`${id} disconnected: ${username}`);
    });
  });

  return server;
};
export default useWebSockets;
