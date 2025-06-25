import { razorpay } from "../utils/razorpayInstance.js"; // this file should export your Razorpay instance
import { Course } from "../Models/course.model.js";
import { CoursePurchase } from "../Models/Course.purchase.model.js";
import { User } from "../Models/user.model.js";
import { Lecture } from "../Models/lecture.model.js";
import crypto from "crypto";
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // 1️⃣ Create Razorpay Order
    const options = {
      amount: course.coursePrice * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // 2️⃣ Save in DB as pending
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.id, // Razorpay Order ID
    });

    await newPurchase.save();

    // 3️⃣ Send back Razorpay order details to frontend
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      courseTitle: course.courseTitle,
      thumbnail: course.courseThumbnail,
      courseId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

export const razorpayWebhook = async (req, res) => {
  console.log("🛎 Webhook endpoint HIT!");
// console.log("Event:", req.body.event);

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET; // same secret set in Razorpay dashboard

  const signature = req.headers["x-razorpay-signature"];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("HI i am prem duffeer");
    console.error("⚠️ Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = body.event;
  const paymentEntity = body.payload.payment?.entity;

  try {
    if (event === "payment.captured") {
      const razorpayOrderId = paymentEntity.order_id;

      const purchase = await CoursePurchase.findOne({
        paymentId: razorpayOrderId,
      }).populate({ path: "courseId" });

      if (!purchase) {
        console.log("HI i am prem duffeer");
        return res.status(404).json({ message: "Purchase not found" });
      }

      purchase.status = "completed";
      purchase.amount = paymentEntity.amount / 100;

      // Unlock all lectures
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user enrollment
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }
      );

      // Update course with enrolled student
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }
      );

      console.log("✅ Payment captured and course enrolled!");
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Server error");
  }

  res.status(200).json({ status: "Webhook handled" });
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    // console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }
    if(!purchased){
      return res.status(200).json({
        course,
        purchased: false, // true if purchased, false otherwise
      })
    }
    console.log(purchased.status);
    return res.status(200).json({
      course,
      purchased: purchased.status === "completed" ? true : false, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};