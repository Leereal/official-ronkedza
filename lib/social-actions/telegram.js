import { createPostResult } from "../actions/postResult.actions";
import { getPlatform } from "../actions/socialPlatform.actions";

const { Telegraf } = require("telegraf");
var bot;

const initializeBot = async () => {
  try {
    const socialPlatform = await getPlatform("telegram-channel");

    if (socialPlatform && socialPlatform.appSecret) {
      bot = await new Telegraf(socialPlatform.appSecret);
    } else {
      console.log("Telegram Bot is not added");
    }
  } catch (error) {
    console.log("Telegram Bot failed to initialize :", error);
  }
};

// Handler for creating a channel post
export const createChannelPost = async (data, telegramToken) => {
  // TODO check the attachment types and use either sendPhoto, sendDocument, sendAudio, sendVideo
  try {
    const { content, attachments } = data;
    const channel = telegramToken.socialId;

    const response = await bot.telegram.sendMessage(channel, content, {
      parse_mode: "markdown",
    });
    let attachmentResponse;
    // If there are attachments, send them
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        // Assuming 'attachment' is a picture path, you might need to adjust accordingly
        attachmentResponse = await bot.telegram.sendPhoto(channel, {
          url: attachment,
        });
      }
    }

    const allResponses = {
      message: response,
      attachments: attachmentResponse,
    };
    createPostResult(data._id, allResponses, telegramToken._id);
  } catch (error) {
    console.error("Error creating channel post:", error);
    // Handle the error appropriately, maybe log it or send an error notification
  }
};

initializeBot();
