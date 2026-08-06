import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import registerMessageSocket from "./message.socket.js";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // TODO: restrict to your actual frontend origin in production
    },
  });

  // Authenticate on connection, the same way verifyJWT does for REST.
  // We never trust a client-supplied user id in a message payload - only
  // the id decoded from a verified token.
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Every connected user automatically has a personal room, used for
    // routing direct messages straight to them.
    socket.join(`user:${socket.data.userId}`);

    registerMessageSocket(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet");
  }
  return io;
};