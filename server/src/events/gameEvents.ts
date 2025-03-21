import { Socket } from 'socket.io';

export const gameEvents = (socket: Socket) => {
  socket.on('createGame', () => {});
  socket.on('joinGame', (gameId: string) => {});
  socket.on('startGame', () => {});
  socket.on('leaveGame', () => {});
  socket.on('makeMove', (move: string) => {});
  socket.on('resignGame', () => {});
  socket.on('offerDraw', () => {});
  socket.on('acceptDraw', () => {});
  socket.on('declineDraw', () => {});
  socket.on('addTime', () => {});
  socket.on('rematchRequest', () => {});
  socket.on('rematchAccept', () => {});
};

//client side game event that will be send
