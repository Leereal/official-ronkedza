import { createPostResult } from "../actions/postResult.actions";
import { connectToDatabase } from "../database";

export const createInstagramPost = async (data, instagramTokens) => {
  const socialPlatform = instagramTokens.socialPlatform;

  try {
    await connectToDatabase();
    const user = await User.findById(data.creator);

    if (!user) {
      throw new Error("User not found");
    }

    if (
      instagramTokens.accessToken &&
      instagramTokens.socialId &&
      instagramTokens.active
      // TODO: Check expiration again (currentTime < instagramTokens.expiration)
    ) {
      const IG_ENDPOINT = socialPlatform.endpoint;
      const socialId = instagramTokens.socialId;
      const userToken = instagramTokens.accessToken;
      const mediaEndpoint = `${IG_ENDPOINT}/${socialId}/media`;
      const mediaPublishEndpoint = `${IG_ENDPOINT}/${socialId}/media_publish`;

      if (data.attachments.length === 1) {
        // Single Image Post
        const createSingleImageUrl = `${mediaEndpoint}?image_url=${encodeURIComponent(
          data.attachments[0]
        )}&caption=${encodeURIComponent(
          data.content
        )}&access_token=${userToken}`;

        const createSingleImageResponse = await fetch(createSingleImageUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const singleImageData = await createSingleImageResponse.json();
        const mediaId = singleImageData.id;

        console.log("Done Posting Single Image on Instagram: ", mediaId);

        // Save the response
        createPostResult(data._id, singleImageData, instagramTokens._id);
      } else if (data.attachments.length > 1) {
        // Carousel Post
        const uploadedMediaIds = await Promise.all(
          data.attachments.map(async (attachment) => {
            const createItemUrl = `${mediaEndpoint}?is_carousel_item=true&image_url=${encodeURIComponent(
              attachment
            )}&access_token=${userToken}`;

            const createItemResponse = await fetch(createItemUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const itemData = await createItemResponse.json();
            return itemData.id;
          })
        );

        const createCarouselUrl = `${mediaEndpoint}?media_type=CAROUSEL&children=${uploadedMediaIds.join(
          ","
        )}&caption=${encodeURIComponent(
          data.content
        )}&access_token=${userToken}`;

        const createCarouselResponse = await fetch(createCarouselUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const carouselData = await createCarouselResponse.json();
        const carouselId = carouselData.id;

        console.log("Done Posting Carousel on Instagram: ", carouselId);

        // Save the response
        createPostResult(data._id, carouselData, instagramTokens._id);
      } else {
        throw Error("No attachments provided for Instagram post");
      }
    } else {
      console.log("You are not logged in Instagram");
      // TODO: Handle the case where the user is not logged in or needs to re-authenticate
    }
  } catch (error) {
    handleError(error);
  }
};
