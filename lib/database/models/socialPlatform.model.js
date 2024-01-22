import { Schema, model, models } from "mongoose";
const SocialPlatformSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    appId: {
      type: String,
      required: false,
    },
    appSecret: {
      type: String,
      required: false,
    },
    endpoint: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const SocialPlatform =
  models.SocialPlatform || model("SocialPlatform", SocialPlatformSchema);

export default SocialPlatform;
