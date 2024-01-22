"use server";

import { handleError } from "@/lib/utils";
import { createPagePost } from "../social-actions/facebook";
import { connectToDatabase } from "../database";

export async function postToSocials(post, socials) {
  try {
    await connectToDatabase();
    for (const social of socials) {
      switch (social.value) {
        case "facebook-page":
          console.log("facebook User");
          createPagePost(post);
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
