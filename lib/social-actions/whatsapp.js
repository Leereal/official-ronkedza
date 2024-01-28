import { createPostResult } from "../actions/postResult.actions";

export const createWhatsappGroupPost = async (data, whatsappToken) => {
  try {
    const { content, attachments } = data;

    // Check if there are attachments and if it's an image
    if (attachments && attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const payload = {
          chatId: whatsappToken.chatId,
          urlFile: attachment, // Assuming 'attachment' is a picture URL
          fileName: "image.png",
          caption: i === 0 ? content || "" : "", // Using content as the caption for the first image only
        };
        await sendWhatsappMessage(
          payload,
          whatsappToken,
          "sendFileByUrl",
          data
        );
      }
    } else {
      // If it's a text message
      const payload = {
        chatId: whatsappToken.chatId,
        message: content,
      };
      await sendWhatsappMessage(payload, whatsappToken, "sendMessage", data);
    }
  } catch (error) {
    console.error("Error creating Whatsapp group post:", error);
    // Handle the error appropriately, maybe log it or send an error notification
  }
};

const sendWhatsappMessage = async (payload, whatsappToken, type, data) => {
  const url = `${whatsappToken.socialPlatform.endpoint}/waInstance${whatsappToken.socialId}/${type}/${whatsappToken.accessToken}`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${JSON.parse(JSON.stringify(response))}`
      );
    }

    const responseData = await response.json();
    createPostResult(data._id, responseData, whatsappToken._id);
  } catch (error) {
    console.error("Error sending Whatsapp message:", error);
    // Handle the error appropriately, maybe log it or send an error notification
  }
};
