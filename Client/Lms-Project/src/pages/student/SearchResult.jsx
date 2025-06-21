import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
   
  return (
     <div className="flex flex-col md:flex-row overflow-hidden justify-between items-start md:items-end border-b border-gray-300 dark:border-gray-700 py-6 gap-6 pt-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-6 w-full md:w-auto flex-grow"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 rounded-lg object-cover shadow-sm"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-xl md:text-2xl text-gray-900 dark:text-gray-100 hover:underline transition">
            {course.courseTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{course.subTitle}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Instructor: <span className="font-semibold">{course.creator?.name}</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100">
            {course.courseLevel}
          </Badge>
          
        </div>
      </Link>
        <div className="mt-4 md:mt-0 flex items-start text-right w-full md:w-auto flex-shrink-0">
        <h1 className="font-bold text-xl md:text-2xl flex items-baseline text-indigo-600 dark:text-indigo-400">
          ₹{course.coursePrice}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;