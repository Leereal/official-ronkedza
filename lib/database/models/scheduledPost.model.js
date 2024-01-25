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
    scheduled_time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "completed", "cancelled", "failed", "paused"],
      required: true,
    },
    recurrence: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: false,
    },
    socialPlatforms: [
      {
        type: Schema.Types.ObjectId,
        ref: "SocialPlatform",
        required: true,
      },
    ],
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
