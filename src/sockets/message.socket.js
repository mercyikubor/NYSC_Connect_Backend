import messagesService from "../services/messages.service.js";

const registerMessageSocket = (io, socket) => {
  const senderId = socket.data.userId;

  // Client must explicitly join a community's room to receive its messages
  socket.on("community:join", (communityId) => {
    socket.join(`community:${communityId}`);
  });

  socket.on("community:leave", (communityId) => {
    socket.leave(`community:${communityId}`);
  });

  socket.on("message:send", async (payload, callback) => {
    const respond = typeof callback === "function" ? callback : () => {};

    try {
      const { type, communityId, receiverId, content, attachments } =
        payload || {};

      let message;

      if (type === "community") {
        message = await messagesService.sendCommunityMessage({
          communityId,
          senderId,
          content,
          attachments,
        });
        io.to(`community:${communityId}`).emit("message:new", message);
      } else if (type === "direct") {
        message = await messagesService.sendDirectMessage({
          senderId,
          receiverId,
          content,
          attachments,
        });
        io.to(`user:${receiverId}`).emit("message:new", message);
        io.to(`user:${senderId}`).emit("message:new", message);
      } else {
        throw new Error("payload.type must be 'community' or 'direct'");
      }

      respond({ success: true, data: message });
    } catch (error) {
      respond({
        success: false,
        message: error.message || "Failed to send message",
      });
    }
  });
};

export default registerMessageSocket;