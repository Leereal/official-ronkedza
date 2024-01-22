import { Schema, model, models } from "mongoose";

const FacebookTokenSchema = new Schema({
  facebookId: { type: String },
  accessToken: { type: String },
  tokenType: { type: String },
  expiresIn: { type: Number },
});

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
    facebookToken: {
      type: FacebookTokenSchema,
      required: false, // Set to false to make it optional
    },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const User = models.User || model("User", UserSchema);

export default User;
