import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import ReactPlayer from "react-player";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }

  }, [completedSuccess]);
  useEffect(() => {
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [inCompletedSuccess]);
  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  console.log(data);

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // initialze the first lecture is not exist
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    // handleLectureProgress(lecture._id);
  };


  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Course Header */}
      <div className="flex justify-between items-center pt-20 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {courseTitle}
        </h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
          className="rounded-full cursor-pointer px-6 py-2 text-sm font-semibold"
        >
          {completed ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark Course Completed"
          )}
        </Button>
      </div>

      {/* Main content layout */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Video Section */}
        <div className="flex-1 md:w-3/5 bg-white dark:bg-gray-900 shadow-md rounded-xl overflow-hidden h-[500px] flex flex-col">
          {/* Video */}
          <ReactPlayer
            url={currentLecture?.videoUrl || courseDetails?.lectures[0].videoUrl}
            controls
              width="100%"
              height="80%"
            className="object-cover rounded-t-xl"
            onProgress={({ played }) => {
              if (played >= 0.8) {
                handleLectureProgress(currentLecture?._id || initialLecture._id);
              } 
            }}
          />
          {/* <div/> */}

          {/* Title Section */}
          <div className="p-2 flex  items-center h-[120px]">
            <h3 className="text-2xl font-bold text-gray-800 mt dark:text-white ">
              Lecture{" "}
              {courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1}
              :{" "}
              <span className="ml-1 italic decoration-blue-500">
                {currentLecture?.lectureTitle || initialLecture.lectureTitle}
              </span>
            </h3>
          </div>

        </div>
        {/* Lecture Sidebar */}
        <div className="w-full md:w-2/5 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Course Lectures
          </h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {courseDetails?.lectures.map((lecture) => {
              const isActive =
                lecture._id === (currentLecture?._id || initialLecture?._id);
              return (
                <Card
                  key={lecture._id}
                  onClick={() => handleSelectLecture(lecture)}
                  className={`transition-all duration-200 cursor-pointer border ${isActive
                    ? "bg-gray-100 dark:bg-gray-800 border-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  <CardContent className="flex items-center justify-between gap-4 px-4 ">
                    <div className="flex items-center gap-3">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2
                          size={22}
                          className="text-green-500 flex-shrink-0"
                        />
                      ) : (
                        <CirclePlay
                          size={22}
                          className="text-gray-400 flex-shrink-0"
                        />
                      )}
                      <CardTitle className="text-base font-medium text-gray-700 dark:text-white">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-600 border border-green-300 text-xs"
                      >
                        Completed
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div >

  );
};

export default CourseProgress;