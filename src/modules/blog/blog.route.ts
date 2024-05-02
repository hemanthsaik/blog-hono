import { Hono } from "hono";
import BlogModel from "./blog.model";
import { customLogger } from "../../config/logger";

const blogs = new Hono();

blogs.get("/", async (c) => {
  const docs = await BlogModel.find();
  return c.json(docs.map((doc) => doc.toObject()));
});

blogs.post("/", async (c) => {
  const body = await c.req.json();

  const newBlogObj = new BlogModel(body);

  try {
    const newBlog = await newBlogObj.save();
    return c.json(newBlog, 200);
  } catch (err) {
    customLogger("Create blog:", `Error: ${(err as any)?.message}`);
    return c.json({ message: "internal server error" }, 500);
  }
});

blogs.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const blogDoc = await BlogModel.findById(id);

    if (!blogDoc) return c.json({ message: "Blog not found" }, 404);

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return c.json(updatedBlog, 200);
  } catch (err) {
    customLogger("Create blog:", `Error: ${(err as any)?.message}`);
    return c.json({ message: "internal server error" }, 500);
  }
});

blogs.get("/:id/id", async (c) => {
  const id = c.req.param("id");
  const doc = await BlogModel.findById(id);

  if (!doc) return c.json({ message: "Blog not found" }, 404);

  return c.json(doc.toObject(), 200);
});

blogs.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const doc = await BlogModel.findOne({
    slug,
  });

  if (!doc) return c.json({ message: "Blog not found" }, 404);

  return c.json(doc.toObject(), 200);
});

blogs.delete("/:id", async (c) => {
  const id = c.req.param("id");

  await BlogModel.findByIdAndDelete(id);

  return c.json({ message: "blog deleted successfully" }, 200);
});

export default blogs;
