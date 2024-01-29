"use server";

import { handleError } from "@/lib/utils";
import { createGroupPost, createPagePost } from "../social-actions/facebook";
import { connectToDatabase } from "../database";
import { createChannelPost } from "../social-actions/telegram";
import { createWhatsappGroupPost } from "../social-actions/whatsapp";
import { createTwitterPost } from "../social-actions/twitter";

const postToSocialsActive = process.env.POST_TO_SOCIALS === "true";
const postToFacebookPages = process.env.POST_TO_FACEBOOK_PAGES === "true";
const postToFacebookGroups = process.env.POST_TO_FACEBOOK_GROUPS === "true";
const postToTelegramChannel = process.env.POST_TO_TELEGRAM_CHANNEL === "true";
const postToWhatsappGroup = process.env.POST_TO_WHATSAPP_GROUPS === "true";
const postToTwitter = process.env.POST_TO_TWITTER === "true";

export async function postToSocials(post, socials) {
  if (postToSocialsActive) {
    try {
      await connectToDatabase();
      //Since we are getting socials as a list of _ids of user socials we want
      for (const social of socials) {
        switch (social.socialPlatform.slug) {
          case "facebook-page":
            if (postToFacebookPages) {
              createPagePost(post, social);
            } else {
              console.log("Posting to pages not active");
            }
            break;

          case "facebook-group":
            if (postToFacebookGroups) {
              createGroupPost(post, social);
            } else {
              console.log("Posting to groups not active");
            }
            break;

          case "telegram-channel":
            if (postToTelegramChannel) {
              createChannelPost(post, social);
            } else {
              console.log("Posting to channels not active");
            }
            break;

          case "whatsapp-group":
            if (postToWhatsappGroup) {
              createWhatsappGroupPost(post, social);
            } else {
              console.log("Posting to whatsapp groups not active");
            }
            break;
          case "twitter":
            if (postToTwitter) {
              createTwitterPost(post, social);
            } else {
              console.log("Posting to twitter not active");
            }
            break;

          default:
            //TODO - handle all other socials
            console.log("Social : ", social.value);
        }
      }

      // return JSON.parse(JSON.stringify(newPost));
    } catch (error) {
      handleError(error);
    }
  } else {
    console.log(`Posting to socials not active`);
  }
}
