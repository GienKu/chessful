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
      origin: [CLIENT_BASE_URL!,'http://192.168.1.71:5173'],
      credentials: true,
    },
  });

  io.use(handleSocketAuth);
  const gameService = GameService.getInstance(io);

  io.on('connection', (socket: Socket) => {
    const user = socket.user || socket.guest;
    const type = socket.user ? 'user' : 'guest';

    if (!user) {

      return;
    }

    socket.emit('connected', {
      id: user.id,
      username: user.username,
      type,
    });

    console.log(
      `Socket:${user.id} has connected with ${
        socket.user ? 'user' : 'guest'
      }: ${user.username}`
    );

    gameService.registerEventHandlers(socket);

    socket.on('disconnect', () => {
      console.log(
        `Socket:${user.id} has disconnected with ${
          socket.user ? 'user' : 'guest'
        }: ${user.username}`
      );
    });
  });

  return server;
};
export default useWebSockets;
