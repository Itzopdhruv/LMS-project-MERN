import React from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseapi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

  const buyCourse = async () => {
    try {
      const { data, error } = await createCheckoutSession(courseId);

      if (error || !data?.success) {
        toast.error("Failed to create order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Your Course Platform",
        description: data.courseTitle,
        image: data.thumbnail,
        order_id: data.orderId,
        handler: function (response) {
          console.log("✅ Payment successful:", response);
          window.location.href = `/course-progress/${data.courseId}`;
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Payment cancelled");
            window.location.href = `/course-detail/${data.courseId}`;
          },
        },
        prefill: {
          name: "Prem Yadav",
          email: "prem@example.com",
        },
        theme: {
          color: "#1a73e8",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Button disabled={isLoading} onClick={buyCourse} className="w-full cursor-pointer">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
