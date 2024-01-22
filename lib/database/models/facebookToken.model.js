import { Schema, model, models } from "mongoose";

const FacebookTokenSchema = new Schema(
  {
    about: { type: String },
    accessToken: { type: String },
    active: { type: Boolean, default: true },
    expiration: { type: Date },
    expiresIn: { type: Number },
    facebookUserId: { type: String },
    followers_count: { type: Number },
    link: { type: String },
    name: { type: String },
    pageId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    userAccessToken: { type: String },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const FacebookToken =
  models.FacebookToken || model("FacebookToken", FacebookTokenSchema);

export default FacebookToken;
