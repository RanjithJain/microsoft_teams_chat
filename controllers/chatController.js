import axios from "axios";

export const createChat = async (req, res) => {
  const userId1 = req.body.userId1;
  const userId2 = req.body.userId2;

  if (!accessToken || !userId1 || !userId2) {
    return res
      .status(400)
      .json({ error: "Access token and user IDs are required" });
  }

  try {
    const chatResponse = await axios.post(
      "https://graph.microsoft.com/v1.0/chats",
      {
        chatType: "oneOnOne",
        members: [
          {
            "@odata.type": "#microsoft.graph.aadUserConversationMember",
            roles: ["owner"],
            "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${userId1}')`,
          },
          {
            "@odata.type": "#microsoft.graph.aadUserConversationMember",
            roles: ["owner"],
            "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${userId2}')`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(chatResponse.data);
  } catch (error) {
    res.status(500).json({ error: `Error creating chat: ${error.message}` });
  }
};
