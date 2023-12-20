import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  featured_image: { type: String },
  scheduled_time: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: false },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
