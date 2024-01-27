"use server";

import { handleError } from "@/lib/utils";
import { createPagePost } from "../social-actions/facebook";
import { connectToDatabase } from "../database";

const postToSocialsActive = process.env.POST_TO_SOCIALS === "true";

export async function postToSocials(post, socials) {
  try {
    await connectToDatabase();
    //Since we are getting socials as a list of _ids of user socials we want
    for (const social of socials) {
      switch (social.socialPlatform.slug) {
        case "facebook-page":
          if (postToSocialsActive) {
            createPagePost(post, social);
          } else {
            console.log(`Posting to social not active for : ${social.name}`);
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
}
