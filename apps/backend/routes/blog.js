const {
  createBlog,
  updateBlog,
  getAllBlogs,
} = require("../controllers/blog.js");
const { verifyJWT } = require("../middleware/auth.js");
const express = require("express");

const router = express.Router();

router.post("/", verifyJWT, createBlog);
router.put("/:id", verifyJWT, updateBlog);
router.get("/", verifyJWT, getAllBlogs);

module.exports = router;
