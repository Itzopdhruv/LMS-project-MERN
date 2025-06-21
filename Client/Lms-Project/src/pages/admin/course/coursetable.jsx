import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <h1 className="text-center mt-20 text-xl font-semibold">
        Loading...
      </h1>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">
          Your Courses
        </h2>
        <Button
          onClick={() => navigate("create")}
          className="rounded-xl"
        >
          + Create New Course
        </Button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="rounded-xl border shadow-sm bg-white p-3 overflow-x-auto">
        <Table>
          <TableCaption className="text-gray-500 mt-2">
            A list of your recently created courses.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center font-semibold">Price</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
              <TableHead className="text-center font-semibold">Title</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!data || data.courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  No courses found. Create your first course!
                </TableCell>
              </TableRow>
            ) : (
              data.courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-semibold text-sm text-gray-700 text-center">
                    ₹{course?.coursePrice || "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={course.isPublished ? "default" : "outline"}
                      className={
                        course.isPublished
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-800 text-center">
                    {course.courseTitle}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
