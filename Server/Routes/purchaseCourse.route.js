import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAllPurchasedCourse } from "../controllers/coursePurchase.controller.js";
import { getCourseDetailWithPurchaseStatus } from "../controllers/coursePurchase.controller.js";
import {
  createCheckoutSession,
  razorpayWebhook, // ✅ updated name
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// ✅ When user clicks Buy
router.route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

// ✅ When Razorpay sends payment event
// ✅ Razorpay webhook route — DO NOT use express.raw() here
router.route("/webhook").post(razorpayWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);

router.route("/").get(isAuthenticated,getAllPurchasedCourse);
export default router;
