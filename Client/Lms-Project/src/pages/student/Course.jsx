import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`} className="transition-transform hover:scale-[1.015]">
      <Card className="w-full h-[360px] flex flex-col justify-between rounded-xl shadow-sm hover:shadow-lg bg-white dark:bg-[#1a1a1a] py-0 overflow-hidden">
        
        {/* Thumbnail */}
        <div className="w-full h-[150px] overflow-hidden bg-gray-100">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Course Content */}
        <CardContent className="flex flex-col justify-between flex-1 px-4 py-3">
          {/* Title */}
          <h1 className="text-sm font-semibold leading-tight mb-2 line-clamp-2 hover:underline">
            {course.courseTitle}
          </h1>

          {/* Creator + Level */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                  alt={course.creator?.name || "creator"}
                />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
              <p className="text-14 text-muted-foreground truncate max-w-[100px]">
                {course.creator?.name || "Unknown"}
              </p>
            </div>
            <Badge className="bg-blue-600 text-white text-[14px] px-2  py-0.5 rounded-full">
              {course.courseLevel}
            </Badge>
          </div>

          {/* Price */}
          <div className="text-smo font-bold text-green-600 flex">₹{course.coursePrice}</div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
