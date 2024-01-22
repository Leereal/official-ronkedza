const mongoose = require("mongoose");

const PostResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      // You can adjust the type based on the structure of the response
    },
    socialPlatform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialPlatform",
      required: true,
    },
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);

const PostResult = mongoose.model("PostResult", PostResultSchema);

module.exports = PostResult;
