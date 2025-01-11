const prisma = require("../prisma");

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to create blog" });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  const { title, content } = req.body;
  const blogId = parseInt(req.params.id);

  try {
    const blog = await prisma.blog.update({
      where: { id: blogId, authorId: req.user.id },
      data: { title, content: JSON.parse(content) },
    });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  const blogs = await prisma.blog.findMany();
  res.status(200).json(blogs);
};

module.exports = { createBlog, updateBlog, getAllBlogs };
