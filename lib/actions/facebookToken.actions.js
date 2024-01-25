"use server";

import { connectToDatabase } from "@/lib/database";
import FacebookToken from "../database/models/facebookToken.model";
import User from "@/lib/database/models/user.model";
import { handleError } from "../utils";
import SocialPlatform from "../database/models/socialPlatform.model";
import { revalidatePath } from "next/cache";

const populateFacebookToken = (query) => {
  return query.populate({
    path: "user",
    model: User,
    select: "_id firstName lastName",
  });
};

const getPageInfo = async (pageId, accessToken) => {
  try {
    const fields = "name,about,link,followers_count,likes,groups";
    const apiUrl = `https://graph.facebook.com/${pageId}?fields=${fields}&access_token=${accessToken}`;

    const response = await fetch(apiUrl);
    const pageInfo = await response.json();

    return pageInfo;
  } catch (error) {
    handleError(error);
  }
};

const exchangeShortTokenForLongToken = async (shortAccessToken) => {
  const app = await SocialPlatform.findOne({ slug: "facebook-page" });
  if (app) {
    try {
      const exchangeUrl = `${app.endpoint}/oauth/access_token?grant_type=fb_exchange_token&client_id=${app.appId}&client_secret=${app.appSecret}&fb_exchange_token=${shortAccessToken}`;

      const exchangeResponse = await fetch(exchangeUrl);
      const exchangeData = await exchangeResponse.json();
      return exchangeData;
    } catch (error) {
      handleError(error);
    }
  }
};

const exchangeUserTokenForPageTokens = async (
  longLivedUserAccessToken,
  userId
) => {
  const app = await SocialPlatform.findOne({ slug: "facebook-page" });
  if (app) {
    try {
      const accountsUrl = `${app.endpoint}/me/accounts?access_token=${longLivedUserAccessToken}`;

      const accountsResponse = await fetch(accountsUrl);
      const accountsData = await accountsResponse.json();
      // Extract and return an array of page tokens
      const pageTokens = await accountsData.data.forEach((page) => {
        savePageAccessToken(userId, {
          pageId: page.id,
          accessToken: page.access_token,
        });
      });
      return accountsData.data;
    } catch (error) {
      handleError(error);
    }
  }
};

const savePageAccessToken = async (userId, data) => {
  //Check if values are correct then get details
  const pageData = await getPageInfo(data.pageId, data.accessToken);
  let newToken;
  try {
    if (!pageData.error) {
      newToken = await FacebookToken.create({
        ...data,
        name: pageData.name || null,
        about: pageData.about || null,
        link: pageData.link || null,
        followers_count: pageData.followers_count || null,
        active: true,
        user: userId,
      });
    } else {
      newToken = pageData.error;
    }
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000 || error.code === 11001) {
      console.error(`Duplicate key error for pageId: ${data.pageId}`);
      // Handle the error, e.g., log it or take appropriate action
    } else {
      // Handle other errors
      console.error(error);
    }
  }
};

export async function autoFacebookAuth(data, callback) {
  try {
    await connectToDatabase();

    const user = await User.findById(data.userId);
    if (!user) throw new Error("User not found");

    //Get long lived token for the user
    const longLivedToken = await exchangeShortTokenForLongToken(
      data.accessToken
    );
    //Save long lived token for the user

    if (longLivedToken) {
      const updatedUser = await User.findByIdAndUpdate(
        data.userId,
        {
          facebookToken: {
            facebookId: data.facebookUserId,
            accessToken: longLivedToken.access_token,
            tokenType: longLivedToken.token_type,
            expiresIn: longLivedToken.expires_in,
          },
        },
        { new: true }
      );

      //Get long lived page tokens and save them
      const pages = await exchangeUserTokenForPageTokens(
        longLivedToken.access_token,
        data.userId
      );

      callback(pages);
    } else {
      callback(null);
    }
  } catch (error) {
    callback(null);
    handleError(error);
  }
}

export async function createFacebookAuth({ userId, data }) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    //Get long lived token for the user
    const longLivedToken = await exchangeShortTokenForLongToken(
      data.accessToken
    );
    let pages;

    if (longLivedToken) {
      //We save long lived token for the user just incase whe need it in future
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "facebookToken.accessToken": longLivedToken.access_token,
            "facebookToken.tokenType": longLivedToken.token_type,
            "facebookToken.expiresIn": longLivedToken.expires_in,
          },
        },
        { new: true }
      );

      //Get long lived page tokens and save them
      pages = await exchangeUserTokenForPageTokens(
        longLivedToken.access_token,
        userId
      );
    }

    revalidatePath("/settings");

    return pages;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateFacebookAuth({ data, userId }) {
  try {
    await connectToDatabase();

    const tokenToUpdate = await FacebookToken.findById(data._id);
    if (!tokenToUpdate || tokenToUpdate.user.toHexString() !== userId) {
      throw new Error("Unauthorized or token not found");
    }
    const updatedFacebookToken = await FacebookToken.findByIdAndUpdate(
      data._id,
      data,
      { new: true }
    );
    revalidatePath("/settings");

    return JSON.parse(JSON.stringify(updatedFacebookToken));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteFacebookAuth(id, path) {
  try {
    await connectToDatabase();

    const deleteFacebookAuth = await FacebookToken.findByIdAndDelete(id);
    if (deleteFacebookAuth) revalidatePath(path);
  } catch (error) {
    console.log("deleteFacebookAuth Error : ", error);
    handleError(error);
  }
}

export async function getFacebookSettingsByUser({ userId, limit = 100, page }) {
  try {
    await connectToDatabase();

    const conditions = { user: userId };
    const skipAmount = (page - 1) * limit;

    const facebookTokensQuery = FacebookToken.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const facebookTokens = await populateFacebookToken(facebookTokensQuery);
    const facebookTokensCount = await FacebookToken.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(facebookTokens)),
      totalPages: Math.ceil(facebookTokensCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
