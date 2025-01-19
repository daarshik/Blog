const express = require("express");
const {
  signIn,
  logout,
  refresh,
  fetchUserDetail,
} = require("../controllers/auth");

const router = express.Router();

router.post("/login", signIn);

// router.get("/check", checkAuth);

router.get("/logout", logout);
router.get("/refresh", refresh);
router.get("/", fetchUserDetail);

module.exports = router;
