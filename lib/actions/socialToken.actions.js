"use server";

import { connectToDatabase } from "@/lib/database";
import SocialToken from "../database/models/socialToken.model";
import User from "@/lib/database/models/user.model";
import { handleError } from "../utils";
import SocialPlatform from "../database/models/socialPlatform.model";
import { revalidatePath } from "next/cache";

const populateSocialToken = (query) => {
  return query
    .populate({
      path: "user",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "socialPlatform",
      model: SocialPlatform,
      select: "_id name slug endpoint",
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
      if (exchangeData.error) {
        throw Error("Invalid token or session expired");
      }

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
        savePageAccessToken(
          userId,
          {
            pageId: page.id,
            accessToken: page.access_token,
          },
          app
        );
      });
      return accountsData.data;
    } catch (error) {
      handleError(error);
    }
  }
};

const savePageAccessToken = async (userId, data, socialPlatform) => {
  //Check if values are correct then get details
  const pageData = await getPageInfo(data.pageId, data.accessToken);
  let newToken;
  try {
    if (!pageData.error) {
      newToken = await SocialToken.create({
        ...data,
        name: pageData.name || null,
        about: pageData.about || null,
        link: pageData.link || null,
        followers_count: pageData.followers_count || null,
        user: userId,
        socialPlatform: socialPlatform._id,
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

export async function autoSocialAuth(data, callback) {
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

export async function createSocialAuth({ userId, data }) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    //Get long lived token for the user
    const longLivedToken = await exchangeShortTokenForLongToken(
      data.accessToken
    );
    let pages;

    if (longLivedToken && !longLivedToken.error) {
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
export async function updateSocialAuth({ data, userId }) {
  try {
    await connectToDatabase();

    const tokenToUpdate = await SocialToken.findById(data._id);
    if (!tokenToUpdate || tokenToUpdate.user.toHexString() !== userId) {
      throw new Error("Unauthorized or token not found");
    }
    const updatedSocialToken = await SocialToken.findByIdAndUpdate(
      data._id,
      data,
      { new: true }
    );
    revalidatePath("/settings");

    return JSON.parse(JSON.stringify(updatedSocialToken));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteSocialAuth(id, path) {
  try {
    await connectToDatabase();

    const deleteSocialAuth = await SocialToken.findByIdAndDelete(id);
    if (deleteSocialAuth) revalidatePath(path);
  } catch (error) {
    console.log("deleteSocialAuth Error : ", error);
    handleError(error);
  }
}

export async function getSocialTokensByUser({ userId, limit = 100, page }) {
  try {
    await connectToDatabase();

    const conditions = { user: userId };
    const skipAmount = (page - 1) * limit;

    const socialTokensQuery = SocialToken.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const socialTokens = await populateSocialToken(socialTokensQuery);
    const socialTokensCount = await SocialToken.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(socialTokens)),
      totalPages: Math.ceil(socialTokensCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET ONE POST BY ID
export async function getSocialTokenById(socialTokenId) {
  try {
    await connectToDatabase();

    const socialToken = await populateSocialToken(
      SocialToken.findById(socialTokenId)
    );

    if (!socialToken) throw new Error("SocialToken not found");

    return JSON.parse(JSON.stringify(socialToken));
  } catch (error) {
    handleError(error);
  }
}
