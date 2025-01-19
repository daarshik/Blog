const { createRazorpayInstance } = require("../config/razorpay.config");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
require("dotenv").config();

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: "receipt_order_1",
  };

  try {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = order_id + "|" + payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, signature, secret);
    if (isValidSignature) {
      // Update the order with payment details
      //   const orders = readData();
      //   const order = orders.find(o => o.order_id === razorpay_order_id);
      //   if (order) {
      //     order.status = 'paid';
      //     order.payment_id = razorpay_payment_id;
      //     writeData(orders);
      //   }
      res.status(200).json({ success: true, message: "Paymeny verified" });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: "verification_failed" });
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error verifying payment" });
  }
};
