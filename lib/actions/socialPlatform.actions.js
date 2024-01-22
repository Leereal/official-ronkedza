"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import SocialPlatform from "../database/models/socialPlatform.model";
import { handleError } from "../utils";

// CREATE
export async function createSocialPlatform({ socialPlatform, path }) {
  try {
    await connectToDatabase();

    //TODO check user role if admin then add
    const newPlatform = await SocialPlatform.create(socialPlatform);
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newPlatform));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateSocialPlatform({ socialPlatform, path }) {
  try {
    await connectToDatabase();

    // const socialPlatformToUpdate = await SocialPlatform.findById(
    //   socialPlatform._id
    // );

    //TODO Check if user is admin first

    const updatedSocialPlatform = await SocialPlatform.findByIdAndUpdate(
      socialPlatform._id,
      { ...socialPlatform },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedSocialPlatform));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteSocialPlatform({ socialPlatformId, path }) {
  try {
    await connectToDatabase();

    const deletedSocialPlatform = await SocialPlatform.findByIdAndDelete(
      socialPlatformId
    );
    if (deletedSocialPlatform) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export const getPlatform = async (name) => {
  try {
    await connectToDatabase();
    const platform = SocialPlatform.findOne({ slug: name });
    return platform;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export async function getAllSocialPlatforms({ query, limit = 100, page }) {
  try {
    await connectToDatabase();

    const nameCondition = query
      ? { name: { $regex: query, $options: "i" } }
      : {};

    const conditions = {
      $and: [nameCondition],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const socialPlatforms = SocialPlatform.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .lean()
      .exec();

    return socialPlatforms;
  } catch (error) {
    handleError(error);
  }
}
