import messagesService from "../services/messages.service.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiresponse.js";
import { getIO } from "../sockets/socket.js";

const messagesController = {
  // POST /messages/community/:communityId
  sendCommunityMessage: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    const message = await messagesService.sendCommunityMessage({
      communityId,
      senderId,
      content,
      attachments,
    });

    // Push to anyone already connected to this community's room
    getIO().to(`community:${communityId}`).emit("message:new", message);

    res
      .status(201)
      .json(new ApiResponse(201, message, "Message sent successfully"));
  }),

  // GET /messages/community/:communityId?page=1&limit=30
  getCommunityMessages: asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const result = await messagesService.getCommunityMessages(communityId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Community messages fetched successfully"),
      );
  }),

  // POST /messages/direct/:receiverId
  sendDirectMessage: asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    const message = await messagesService.sendDirectMessage({
      senderId,
      receiverId,
      content,
      attachments,
    });

    getIO().to(`user:${receiverId}`).emit("message:new", message);
    getIO().to(`user:${senderId}`).emit("message:new", message);

    res
      .status(201)
      .json(new ApiResponse(201, message, "Message sent successfully"));
  }),

  // GET /messages/direct/:otherUserId?page=1&limit=30
  getDirectMessages: asyncHandler(async (req, res) => {
    const { otherUserId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const userId = req.user.id;

    const result = await messagesService.getDirectMessages(
      userId,
      otherUserId,
      { page, limit },
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Direct messages fetched successfully"),
      );
  }),
  // GET /messages/chats?page=1&limit=20
  getChats: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await messagesService.getChats(userId, {
      page,
      limit,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Chats fetched successfully"));
  }),

  // GET /messages/chats/search?q=john
  searchChats: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { q } = req.query;

    const limit = Number(req.query.limit) || 20;

    const result = await messagesService.searchChats(userId, q, {
      limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Chats search completed successfully"),
      );
  }),

  // GET /messages/direct/:otherUserId/search?q=text&page=1&limit=30
  searchMessages: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { q } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const result = await messagesService.searchMessages(
      userId,
      otherUserId,
      q,
      {
        page,
        limit,
      },
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Messages search completed successfully"),
      );
  }),

  // PATCH /messages/direct/:otherUserId/read
  markMessagesAsRead: asyncHandler(async (req, res) => {
    const receiverId = req.user.id;
    const { otherUserId } = req.params;

    const result = await messagesService.markMessagesAsRead(
      otherUserId,
      receiverId,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Messages marked as read successfully"),
      );
  }),
};

export default messagesController;
