import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseapi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
  
  if (isLoading) return <h1 className="text-center text-lg font-semibold">Loading...</h1>;
  if (isError) return <h1 className="text-center text-red-500">Failed to load course details</h1>;

  const { course, purchased } = data;
  // console.log(purchased , "HIiiiiiii");

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5 overflow-hidden h-screen font-sans ">
      <div className="bg-[#2D2F31] sticky top-0 text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto text-left py-5 px-4 md:px-8 flex flex-col gap-3">
          <h1 className="font-extrabold text-3xl md:text-4xl leading-snug tracking-wide">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg text-gray-300">{course?.subTitle}</p>
          <p className="text-sm md:text-base text-gray-200">
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic font-medium">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <BadgeInfo size={16} />
            <p>Last updated {course?.updatedAt.split("T")[0]}</p>
          </div>
          <p className="text-sm text-gray-300">Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-6 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-2/3 space-y-6">
          <h1 className="font-bold text-2xl md:text-3xl text-left flex text-[#2D2F31]">
            Description
          </h1>
          <div className="max-h-[400px] overflow-hidden text-base leading-relaxed ">
            <p
              className="whitespace-pre-line text-left text-gray-700 font-[450]"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-left text-xl text-[#2D2F31]">Course Content</CardTitle>
              <CardDescription className="text-left text-gray-600">
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[350px] overflow-y-auto hide-scrollbar pr-2">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-base font-medium text-gray-800">
                   {lecture.isPreviewFree === true ?<PlayCircle size={20} /> :
                      (
                        purchased ? <PlayCircle size={20} /> :  <Lock size={20} />
                      )
                   } 
                  <p className="text-lg">{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card className="shadow-lg">
            <CardContent className="p-5 pb-0 flex flex-col">
              <div className="w-full aspect-video mb-4 rounded-lg bg-gray-200">
                <ReactPlayer width="100%" height={"100%"} className="rounded-lg"   url={course?.lectures[0]?.videoUrl || "Course has no associated video"}
                  controls={true}/>
              </div>
              <h1 className="text-left text-base font-medium text-gray-700">
                Lecture title: {course.lectures[0].lectureTitle}
              </h1>
              <Separator className="my-3" />
              <h1 className="text-xl font-semibold text-left text-[#2D2F31]">
                Course Price: ₹{course.coursePrice}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-5 pt-0 ">
              {purchased ? (
                <Button className="w-full text-white cursor-pointer bg-[#4F46E5] hover:bg-[#4338CA]" onClick={handleContinueCourse}>
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton className="cursor-pointer" courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
