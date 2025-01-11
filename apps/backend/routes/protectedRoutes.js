const express = require("express");
const { verifyJWT } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", verifyJWT, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

module.exports = router;
