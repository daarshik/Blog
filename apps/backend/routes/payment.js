//   const { verifyJWT } = require("../middleware/auth.js");
const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/payment");

const router = express.Router();

router.post("/createOrder", createOrder);
router.post("/verifyPayment", verifyPayment);

module.exports = router;
