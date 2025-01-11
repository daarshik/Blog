const express = require("express");
const { signIn, logout, refresh } = require("../controllers/auth");

const router = express.Router();

router.post("/login", signIn);

// router.get("/check", checkAuth);

router.post("/logout", logout);
router.get("/refresh", refresh);

module.exports = router;
