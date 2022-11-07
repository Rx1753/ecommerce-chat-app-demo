import { ChatRoom } from '../models/ChatRoom';
import { ChatMessage } from '../models/ChatMessage';

export default {
  deleteRoomById: async (req: any, res: any) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoom.remove({ _id: roomId });
      const messages = await ChatMessage.remove({ chatRoomId: roomId });
      return res.status(200).json({
        success: true,
        message: 'Operation performed succesfully',
        deletedRoomsCount: room.deletedCount,
        deletedMessagesCount: messages.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  deleteMessageById: async (req: any, res: any) => {
    try {
      const { messageId } = req.params;
      const message = await ChatMessage.remove({ _id: messageId });
      return res.status(200).json({
        success: true,
        deletedMessagesCount: message.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
