import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError)
    return (
      <div className="text-center py-10 text-red-600 text-xl font-semibold">
        ❌ Failed to load courses. Please try again later.
      </div>
    );

  return (
    <div className="bg-gray-50 dark:bg-[#141414] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-extrabold text-3xl md:text-4xl text-center mb-12 text-blue-600">
          Our Courses
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses?.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
const CourseSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1F1F1F] rounded-xl overflow-hidden shadow-sm animate-pulse">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
};
