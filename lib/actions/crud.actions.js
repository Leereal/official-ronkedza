import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";

export const createModel = async (model, data) => {
  try {
    await connectToDatabase();
    const newModel = await model.create(data);
    return JSON.parse(JSON.stringify(newModel));
  } catch (error) {
    handleError(error);
  }
};

export const getModelById = async (model, modelId) => {
  try {
    await connectToDatabase();
    const foundModel = await model.findById(modelId);
    if (!foundModel) throw new Error(`${model.modelName} not found`);
    return JSON.parse(JSON.stringify(foundModel));
  } catch (error) {
    handleError(error);
  }
};

export const updateModel = async (model, userId, modelData, path) => {
  try {
    await connectToDatabase();
    const modelToUpdate = await model.findById(modelData._id);

    if (!modelToUpdate || modelToUpdate.user.toHexString() !== userId) {
      throw new Error(`Unauthorized or ${model.modelName} not found`);
    }

    const updatedModel = await model.findByIdAndUpdate(
      modelData._id,
      modelData,
      {
        new: true,
      }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedModel));
  } catch (error) {
    handleError(error);
  }
};

export const deleteModel = async (model, modelId, path) => {
  try {
    await connectToDatabase();
    const deletedModel = await model.findByIdAndDelete(modelId);

    if (deletedModel) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};

export const getAllModels = async (model, { query, limit = 6, page }) => {
  try {
    await connectToDatabase();
    const skipAmount = (Number(page) - 1) * limit;
    const modelsQuery = model
      .find({})
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const models = await modelsQuery;
    const modelsCount = await model.countDocuments({});

    return {
      data: JSON.parse(JSON.stringify(models)),
      totalPages: Math.ceil(modelsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

export const getModelsByUser = async (model, { userId, limit = 6, page }) => {
  try {
    await connectToDatabase();
    const conditions = { user: userId };
    const skipAmount = (page - 1) * limit;

    const modelsQuery = model
      .find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const models = await modelsQuery;
    const modelsCount = await model.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(models)),
      totalPages: Math.ceil(modelsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

//=============== Examples of how to use this file==============//

// import {
//     createModel,
//     getModelById,
//     updateModel,
//     deleteModel,
//     getAllModels,
//     getModelsByUser,
//   } from "@/path/to/your/generic/actions";
//   import ScheduledPost from "@/lib/database/models/scheduledPost.model";

//   export const createScheduledPost = async (postId, response, socialPlatform) => {
//     const data = {
//       post: postId,
//       user: /* specify user ID here */,
//       scheduled_time: /* specify scheduled time here */,
//       completed: /* specify completed status here */,
//       recurrence: /* specify recurrence here */,
//       socialPlatform: socialPlatform,
//     };

//     return createModel(ScheduledPost, data);
//   };

//   export const getScheduledPostById = async (scheduledPostId) => {
//     return getModelById(ScheduledPost, scheduledPostId);
//   };

//   export const updateScheduledPost = async (userId, scheduledPost, path) => {
//     return updateModel(ScheduledPost, userId, scheduledPost, path);
//   };

//   export const deleteScheduledPost = async (scheduledPostId, path) => {
//     return deleteModel(ScheduledPost, scheduledPostId, path);
//   };

//   export const getAllScheduledPosts = async ({ query, limit = 6, page }) => {
//     return getAllModels(ScheduledPost, { query, limit, page });
//   };

//   export const getScheduledPostsByUser = async ({ userId, limit = 6, page }) => {
//     return getModelsByUser(ScheduledPost, { userId, limit, page });
//   };
