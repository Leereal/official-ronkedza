import { Schema, model, models } from "mongoose";

const ScheduledPostSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    socialTokens: [
      {
        type: Schema.Types.ObjectId,
        ref: "SocialToken",
        required: true,
      },
    ],
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date },
    recurrence: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      required: false,
    },
    status: {
      type: String,
      enum: ["new", "completed", "cancelled", "failed", "paused"],
      required: true,
      default: "new",
    },

    timezone: {
      type: String,
      required: true,
      default: "UTC", // set a default or make it required based on your needs
    },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const ScheduledPost =
  models.ScheduledPost || model("ScheduledPost", ScheduledPostSchema);

export default ScheduledPost;
