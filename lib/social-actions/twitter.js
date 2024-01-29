import { TwitterApi } from "twitter-api-v2";
import { createPostResult } from "../actions/postResult.actions";
import tempWrite from "temp-write";
import { promisify } from "util";
import fs from "fs";
import { getPlatform } from "../actions/socialPlatform.actions";

const writeFileAsync = promisify(fs.writeFile);

const uploadMedia = async (client, attachmentUrl) => {
  // Download image from URL
  const response = await fetch(attachmentUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  // Save the image to a temporary file
  const tempFilePath = await tempWrite(buffer, "temp-image.jpg");

  // Upload media from local file
  const mediaId = await client.v1.uploadMedia(tempFilePath);

  // Remove temporary file
  await writeFileAsync(tempFilePath, "");

  return mediaId;
};

export const createTwitterPost = async (data, twitterToken) => {
  try {
    const { content, attachments } = data;
    //Get socialPlatform tokens
    const socialPlatform = await getPlatform(twitterToken.socialPlatform.slug);
    const client = new TwitterApi({
      appKey: socialPlatform.appId,
      appSecret: socialPlatform.appSecret,
      accessToken: twitterToken.accessToken,
      accessSecret: twitterToken.accessSecret,
    });

    const twitterClient = client.readWrite;

    let mediaIds = [];
    let response;

    // Upload all media files
    if (attachments && attachments.length) {
      mediaIds = await Promise.all(
        attachments.map((attachment) => uploadMedia(client, attachment))
      );
    }

    // Tweet with media if mediaIds are available
    if (mediaIds.length > 0) {
      response = await twitterClient.v2.tweet({
        text: content,
        media: { media_ids: mediaIds },
      });
    } else {
      // Tweet without media
      response = await twitterClient.v2.tweet(content);
    }

    // If needed, handle the response from the tweet API call

    // Create post result or handle success
    createPostResult(data._id, response, twitterToken._id);
  } catch (error) {
    console.error("Error creating Twitter post:", error.message);
    // Handle the error appropriately, maybe log it or send an error notification

    // Create post result or handle failure
    createPostResult(
      data._id,
      { success: false, error: error.message },
      twitterToken._id
    );
  }
};
