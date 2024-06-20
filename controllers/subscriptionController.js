import axios from "axios";
const clientState = "secretClientValue";

export const createSubscription = async (req, res) => {
  const { chatId, callbackUrl, lifecycleNotificationUrl } = req.body;

  if (!accessToken || !chatId || !callbackUrl) {
    return res
      .status(400)
      .json({ error: "Access token, chat ID, and callback URL are required" });
  }

  try {
    const subscriptionResponse = await axios.post(
      "https://graph.microsoft.com/v1.0/subscriptions",
      {
        changeType: "created",
        notificationUrl: callbackUrl,
        resource: `chats/${chatId}/messages`,
        lifecycleNotificationUrl: lifecycleNotificationUrl,
        expirationDateTime: new Date(Date.now() + 3600 * 1000).toISOString(), // Set expiration to 1 hour from now
        clientState: "secretClientValue",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(subscriptionResponse.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error creating subscription: ${error.message}` });
  }
};

export const webhook = async (req, res) => {
  if (req.query && req.query.validationToken) {
    // Respond to validation request
    console.log("Validation request received:", req.query.validationToken);
    res.status(200).send(req.query.validationToken);
  } else {
    // Handle actual notifications
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const notification = req.body;
    if (notification.value && notification.value.length > 0) {
      const { resource, clientState: receivedClientState } =
        notification.value[0];

      if (receivedClientState !== clientState) {
        return res.status(400).json({ error: "Client state mismatch" });
      }

      // Extract the chat ID and message ID using a regex
      const resourceRegex = /chats\('([^']+)'\)\/messages\('([^']+)'\)/;
      const match = resourceRegex.exec(resource);

      if (match) {
        const chatId = match[1];
        const messageId = match[2];
        console.log("chat id ", chatId);
        console.log("message id in the response ", messageId);

        try {
          // Fetch messages from the chat
          const response = await axios.get(
            `https://graph.microsoft.com/v1.0/chats/${chatId}/messages?$top=5`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const messages = response.data.value;
          console.log(messages);
          let targetMessage = null;
          if (messages.length === 0) {
            return res
              .status(404)
              .json({ error: "No messages found in the chat." });
          }

          // Loop through messages to find the target message
          for (const message of messages) {
            if (message.id === messageId) {
              targetMessage = message;
              break;
            }
          }

          if (targetMessage) {
            const displayName = targetMessage.from?.user?.displayName || "User";
            console.log("Message is returned", displayName);
            if (displayName === "xxxxx") {
              res.json({ message: "Auto-reply Not sent .", targetMessage });
            } else {
              // Send auto-reply message
              const replyContent = `Hello xxx User, Thank You cor contacting us. We will get in touvh with you shortly.`;
              await axios.post(
                `https://graph.microsoft.com/v1.0/chats/${chatId}/messages`,
                {
                  body: {
                    content: replyContent,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              res.json({
                message: "Auto-reply sent successfully.",
                replyContent,
              });
            }
          }
        } catch (error) {
          res
            .status(500)
            .json({ error: `Error processing message: ${error.message}` });
        }
      }
    }
  }
};

export const lifecycle = (req, res) => {
  if (req.query.validationToken) {
    // Respond to validation request
    res.status(200).send(req.query.validationToken);
  } else {
    // Handle actual lifecycle events
    console.log("Lifecycle event received:", req.body);
    res.sendStatus(200);
  }
};

export const handleCallback = (req, res) => {
  const validationToken = req.query.validationToken;

  if (validationToken) {
    return res.send(validationToken);
  }

  const notification = req.body;
  console.log("Notification received:", notification);

  // Handle the notification (e.g., process the new message)

  res.sendStatus(202);
};
