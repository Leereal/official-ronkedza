"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Post from "@/lib/database/models/post.model";
import SocialPlatform from "@/lib/database/models/socialPlatform.model";
import { handleError } from "@/lib/utils";
import ScheduledPost from "@/lib/database/models/scheduledPost.model";

const populateScheduledPost = (query) => {
  return query
    .populate({
      path: "user",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "post",
      model: Post,
      select: "_id title featured_image createdAt",
    })
    .populate({
      path: "socialPlatforms",
      model: SocialPlatform,
      select: "_id name slug",
    });
};

export async function createScheduledPost({
  postId,
  userId,
  scheduledTime,
  socialPlatforms,
}) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const newScheduledPost = await ScheduledPost.create({
      user: userId,
      post: postId,
      scheduled_time: scheduledTime,
      socialPlatforms: socialPlatforms,
    });

    return JSON.parse(JSON.stringify(newScheduledPost));
  } catch (error) {
    handleError(error);
  }
}

export async function getScheduledPostById(scheduledPostId) {
  try {
    await connectToDatabase();
    const scheduledPost = await populateScheduledPost(
      ScheduledPost.findById(scheduledPostId)
    );

    if (!scheduledPost) throw new Error("ScheduledPost not found");

    return JSON.parse(JSON.stringify(scheduledPost));
  } catch (error) {
    handleError(error);
  }
}

export async function updateScheduledPost({ userId, scheduledPost, path }) {
  try {
    await connectToDatabase();
    const scheduledPostToUpdate = await ScheduledPost.findById(
      scheduledPost._id
    );

    if (
      !scheduledPostToUpdate ||
      scheduledPostToUpdate.user.toHexString() !== userId
    ) {
      throw new Error("Unauthorized or ScheduledPost not found");
    }

    const updatedScheduledPost = await ScheduledPost.findByIdAndUpdate(
      scheduledPost._id,
      scheduledPost,
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedScheduledPost));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteScheduledPost({ scheduledPostId, path }) {
  try {
    await connectToDatabase();
    const deletedScheduledPost = await ScheduledPost.findByIdAndDelete(
      scheduledPostId
    );

    if (deletedScheduledPost) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function getAllScheduledPosts({ query, limit = 6, page }) {
  try {
    await connectToDatabase();
    const skipAmount = (Number(page) - 1) * limit;
    const scheduledPostsQuery = ScheduledPost.find({})
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const scheduledPosts = await populateScheduledPost(scheduledPostsQuery);
    const scheduledPostsCount = await ScheduledPost.countDocuments({});

    return {
      data: JSON.parse(JSON.stringify(scheduledPosts)),
      totalPages: Math.ceil(scheduledPostsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getScheduledPostsByUser({ userId, limit = 6, page }) {
  try {
    await connectToDatabase();
    const conditions = { user: userId };
    const skipAmount = (page - 1) * limit;

    const scheduledPostsQuery = ScheduledPost.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const scheduledPosts = await populateScheduledPost(scheduledPostsQuery);
    const scheduledPostsCount = await ScheduledPost.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(scheduledPosts)),
      totalPages: Math.ceil(scheduledPostsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
