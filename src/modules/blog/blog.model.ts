import { Schema, model } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  body: Object;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogModel = model("Blogs", blogSchema);

export default BlogModel;
