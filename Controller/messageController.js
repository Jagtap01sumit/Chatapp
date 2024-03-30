import Conversation from "../Models/ConversationModel.js";
import Message from "../Models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("message: " + message);
    const { id: receiverId } = req.params;
    const senderId = req.user._id; //user is get fromm the protection token funtion

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    console.log(conversation);
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    console.log(newMessage._id);
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    //optimise version is :

    await Promise.all([conversation.save(), newMessage.save()]); //this will run in parallel
    //TODO: SOCKET IO FUNTIONALITY ADD HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //io.to(<socket._id) .emit() userd to send events to specific client

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log("error at sendMessage", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json("Internal serer error ", error);
  }
};
