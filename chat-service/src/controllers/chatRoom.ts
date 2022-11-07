// utils
//import makeValidation from '@withvoid/make-validation';
// models
import { ChatRoom, CHAT_ROOM_TYPES } from '../models/ChatRoom';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';

export default {
  initiate: async (req: any, res: any) => {
    try {
      // const validation = makeValidation((types) => ({
      //   payload: req.body,
      //   checks: {
      //     userIds: {
      //       type: types.array,
      //       options: { unique: true, empty: false, stringOnly: true },
      //     },
      //     type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
      //   },
      // }));
      //if (!validation.success) return res.status(400).json({ ...validation });
      const { userIds, type } = req.body;
      const { userId: chatInitiator } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoom.initiateChat(
        allUserIds,
        type,
        chatInitiator
      );
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  postMessage: async (req: any, res: any) => {
    try {
      const { roomId } = req.params;
      // const validation = makeValidation((types) => ({
      //   payload: req.body,
      //   checks: {
      //     messageText: { type: types.string },
      //   },
      // }));
      // if (!validation.success) return res.status(400).json({ ...validation });

      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      const post = await ChatMessage.createPostInChatRoom(
        roomId,
        messagePayload,
        currentLoggedUser
      );
      //global.io.sockets.in(roomId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getRecentConversation: async (req: any, res: any) => {
    try {
      const currentLoggedUser = req.userId;
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const rooms = await ChatRoom.getChatRoomsByUserId(currentLoggedUser);
      const roomIds = rooms.map((room: any) => room._id);
      const recentConversation = await ChatMessage.getRecentConversation(
        roomIds,
        options,
        currentLoggedUser
      );
      return res
        .status(200)
        .json({ success: true, conversation: recentConversation });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getConversationByRoomId: async (req: any, res: any) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoom.getChatRoomByRoomId(roomId);
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        });
      }
      const users = await User.getUserByIds(room.userIds);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const conversation = await ChatMessage.getConversationByRoomId(
        roomId,
        options
      );
      return res.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  markConversationReadByRoomId: async (req: any, res: any) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoom.getChatRoomByRoomId(roomId);
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        });
      }

      const currentLoggedUser = req.userId;
      const result = await ChatMessage.markMessageRead(
        roomId,
        currentLoggedUser
      );
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  },
};
