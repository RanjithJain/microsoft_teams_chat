import { fetchAllMessages } from "../models/messageModel.js";
import axios from "axios";

export const healthCheck = async (req, res) => {
  try {
    const messages = await fetchAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  if (!accessToken || !chatId || !message) {
    return res
      .status(400)
      .json({ error: "Access token, chat ID, and message are required" });
  }

  try {
    const messageResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/chats/${chatId}/messages`,
      {
        body: {
          content: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(messageResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Error sending message: ${error.message}` });
  }
};
