import { Schema, model, models } from "mongoose";

const SocialTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    socialPlatform: {
      type: Schema.Types.ObjectId,
      ref: "SocialPlatform",
      required: true,
    },
    about: { type: String },
    accessToken: { type: String },
    active: { type: Boolean, default: true },
    expiration: { type: Date },
    expiresIn: { type: Number },
    facebookUserId: { type: String },
    followers_count: { type: Number },
    link: { type: String },
    name: { type: String },
    socialId: { type: String, unique: true },
    userAccessToken: { type: String },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const SocialToken =
  models.SocialToken || model("SocialToken", SocialTokenSchema);

export default SocialToken;
