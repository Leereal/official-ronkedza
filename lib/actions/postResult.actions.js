"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";
import Post from "../database/models/post.model";
import SocialPlatform from "../database/models/socialPlatform.model";
import PostResult from "../database/models/postResult.model";

const populatePostResult = (query) => {
  return query
    .populate({
      path: "user",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "post",
      model: Post,
      select: "_id title attachments createdAt",
    })
    .populate({
      path: "socialPlatform",
      model: SocialPlatform,
      select: "_id name slug",
    });
};

// CREATE
export async function createPostResult(postId, response, socialPlatform) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    //Check if success
    const success = response.error ? false : true;
    const newPostResult = await PostResult.create({
      user: post.creator,
      post: post._id,
      success,
      response,
      socialPlatform,
    });

    return JSON.parse(JSON.stringify(newPostResult));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE POSTRESULT BY ID
export async function getPostResultById(postResultId) {
  try {
    await connectToDatabase();

    const postResult = await populatePostResult(
      PostResult.findById(postResultId)
    );

    if (!postResult) throw new Error("PostResult not found");

    return JSON.parse(JSON.stringify(postResult));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updatePostResult({ userId, postResult, path }) {
  try {
    await connectToDatabase();

    const postResultToUpdate = await PostResult.findById(postResult._id);
    if (
      !postResultToUpdate ||
      postResultToUpdate.user.toHexString() !== userId
    ) {
      throw new Error("Unauthorized or postResult not found");
    }

    const updatedPostResult = await PostResult.findByIdAndUpdate(
      postResult._id,
      postResult,
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedPostResult));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deletePostResult({ postResultId, path }) {
  try {
    await connectToDatabase();

    const deletedPostResult = await PostResult.findByIdAndDelete(postResultId);
    if (deletedPostResult) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL POSTSRESULTS
export async function getAllPostResults({ query, limit = 6, page }) {
  try {
    await connectToDatabase();

    // TODO Get post result based on title of post
    // const titleCondition = query
    //   ? { title: { $regex: query, $options: "i" } }
    //   : {};

    // const conditions = {
    //   $and: [
    //     titleCondition,
    //     categoryCondition ? { category: categoryCondition._id } : {},
    //   ],
    // };

    const skipAmount = (Number(page) - 1) * limit;
    const postResultsQuery = PostResult.find({})
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const postResults = await populatePostResult(postResultsQuery);
    const postResultsCount = await PostResult.countDocuments({});

    return {
      data: JSON.parse(JSON.stringify(postResults)),
      totalPages: Math.ceil(postResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET POSTS BY ORGANIZER
export async function getPostResultsByUser({ userId, limit = 6, page }) {
  try {
    await connectToDatabase();

    const conditions = { user: userId };
    const skipAmount = (page - 1) * limit;

    const postResultsQuery = PostResult.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const postResults = await populatePostResult(postResultsQuery);
    const postResultsCount = await PostResult.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(postResults)),
      totalPages: Math.ceil(postResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED POSTS: POSTS WITH SAME CATEGORY
export async function getPostResultsByPlatform({
  socialPlatformId,
  postResultId,
  limit = 3,
  page = 1,
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ socialPlatform: socialPlatformId }],
    };

    const postResultsQuery = PostResult.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const postResults = await populatePostResult(postResultsQuery);
    const postResultsCount = await Post.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(postResults)),
      totalPages: Math.ceil(postResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
