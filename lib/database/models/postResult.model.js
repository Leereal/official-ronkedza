import { Schema, model, models } from "mongoose";

const PostResultSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    response: {
      type: Schema.Types.Mixed,
      // You can adjust the type based on the structure of the response
    },
    socialPlatform: {
      type: Schema.Types.ObjectId,
      ref: "SocialPlatform",
      required: true,
    },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const PostResult = models.PostResult || model("PostResult", PostResultSchema);

export default PostResult;
