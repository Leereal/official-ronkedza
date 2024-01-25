//Get facebook auth for the user
import { createPostResult } from "../actions/postResult.actions";
import { getPlatform } from "../actions/socialPlatform.actions";
import { connectToDatabase } from "../database";
import FacebookToken from "../database/models/facebookToken.model";
import Post from "../database/models/post.model";
import PostResult from "../database/models/postResult.model";
import SocialPlatform from "../database/models/socialPlatform.model";
import User from "../database/models/user.model";
import { handleError } from "../utils";

// const socialPlatform = SocialPlatform.findOne({ slug: "facebook-page" });
// const FB_ENDPOINT = socialPlatform.endpoint;

export const createPagePost = async (data) => {
  try {
    await connectToDatabase();

    const user = await User.findById(data.creator);

    if (!user) {
      throw new Error("User not found");
    }

    const facebookTokens = await FacebookToken.findOne({ user: data.creator });
    const currentTime = new Date();

    if (
      facebookTokens.accessToken &&
      facebookTokens.pageId &&
      facebookTokens.active
      //TODO check expiration again currentTime < facebookTokens.expiration
    ) {
      const app = await getPlatform("facebook-page");
      const FB_ENDPOINT = app.endpoint;
      let apiUrl;
      const pageId = facebookTokens.pageId;
      const pageToken = facebookTokens.accessToken;
      let postData = {
        access_token: facebookTokens.accessToken,
      };

      if (data.images) {
        // Upload all images first
        const uploadedPhotoIds = await Promise.all(
          data.images.map(async (image) => {
            const uploadUrl = `${FB_ENDPOINT}/${pageId}/photos`;

            const uploadData = {
              access_token: pageToken,
              url: image,
              published: false, // Upload without publishing
            };

            const uploadResponse = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(uploadData),
            });

            const uploadResult = await uploadResponse.json();
            return uploadResult.id;
          })
        );
        postData.message = data.content;
        postData.attached_media = uploadedPhotoIds.map((photoId) => ({
          media_fbid: photoId,
        }));
      } else if (data.featured_image) {
        apiUrl = `${FB_ENDPOINT}/${pageId}/photos`;
        postData.url = data.featured_image;
        postData.caption = data.content;
      } else {
        apiUrl = `${FB_ENDPOINT}/${pageId}/feed`;
        postData.message = data.content;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();

      //Save the response
      createPostResult(data._id, responseData, app._id);
    } else {
      console.log("You are not logged in Facebook");
      // TODO - Tell the user to log in to Facebook first and repost to socials
      // Remove the records in facebookTokens if any so that the user will be able to create a new one
      // Update the database to show that the post was not successful so that we can retry or find solutions
    }
  } catch (error) {
    handleError(error);
  }
};

export const updatePagePost = async (data) => {};
export const deletePagePost = async (data) => {};

//=====NODE EXAMPLE=====//

//GET ONLY USER'S NAME AND ID
/*https://graph.facebook.com/v18.0/me?access_token=ACCESS-TOKEN*/

//=====EDGES EXAMPLES===//

//GET USER ID, NAME, EMAIL and PICTURE
/*https://graph.facebook.com/v18.0/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN
{
    "id": "USER-ID",
    "name": "EXAMPLE NAME",
    "email": "EXAMPLE@EMAIL.COM",
    "picture": {
      "data": {
        "height": 50,
        "is_silhouette": false,
        "url": "URL-FOR-USER-PROFILE-PICTURE",
        "width": 50
      }
    }
  }*/

//GET USER LIST OF PHOTOS
/*https://graph.facebook.com/v18.0/USER-ID/photos?access_token=ACCESS-TOKEN
    {
  "data": [
    {
      "created_time": "2017-06-06T18:04:10+0000",
      "id": "1353272134728652"
    },
    {
      "created_time": "2017-06-06T18:01:13+0000",
      "id": "1353269908062208"
    }
  ],
}*/

//=====FIELDS EXAMPLES=====//
//Fields limit what you want to be returned

/*https://graph.facebook.com/v18.0/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN
{
  "id": "USER-ID",
  "name": "EXAMPLE NAME",
  "email": "EXAMPLE@EMAIL.COM",
  "picture": {
    "data": {
      "height": 50,
      "is_silhouette": false,
      "url": "URL-FOR-USER-PROFILE-PICTURE",
      "width": 50
    }
  }
}
*/

//PUBLISHING TO PAGE
//After publishing you can also get other fields than the default ID only by including the fields list

//Method must be POST
/*https://graph.facebook.com/v18.0/PAGE-ID/feed?message=Hello&fields=created_time,from,id,message&access_token=ACCESS-TOKEN
{
  "created_time": "2017-04-06T22:04:21+0000",
  "from": {
    "name": "My Facebook Page",
    "id": "PAGE-ID"
  },
  "id": "POST_ID",
  "message": "Hello",
}
*/

//DELETE POST OR PHOTO NODE
//Method must be DELETE
/*https://graph.facebook.com/PHOTO-ID?access_token=ACCESSS-TOKEN*/
//Usually you can only delete nodes that you created, but check each node's reference guide to see requirements for delete operations.

//Handling error - https://developers.facebook.com/docs/graph-api/guides/error-handling
//Pages API - https://developers.facebook.com/docs/pages-api
//Graph API References - https://developers.facebook.com/docs/graph-api/reference/
//Webhooks for notifications - https://developers.facebook.com/docs/graph-api/webhooks
//Versioning - https://developers.facebook.com/docs/graph-api/guides/versioning
//Various APIs, SDKs and Platforms - https://developers.facebook.com/docs#apis-and-sdks
