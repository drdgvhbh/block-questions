import { Server } from 'http';
import socketIO from 'socket.io';

let io: SocketIO.Server;

export const connect = (server: Server) => {
  io = socketIO(server);
};

export const getSocket = () => io;
