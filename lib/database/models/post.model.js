import { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    attachments: {},
    is_published: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    originalPost: { type: Schema.Types.ObjectId, ref: "Post" },
    // TODO Field for drafts or published
  },
  {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
  }
);
// Add a virtual field to retrieve the original post details
PostSchema.virtual("originalPostDetails", {
  ref: "Post",
  localField: "originalPost",
  foreignField: "_id",
  justOne: true,
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
