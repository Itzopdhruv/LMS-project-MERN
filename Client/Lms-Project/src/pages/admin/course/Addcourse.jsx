import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading,isError,error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  // for displaying toast
  useEffect(()=>{
    if(isSuccess){
        toast.success(data?.message || "Course created.");
        navigate("/admin/course");
    }
    if(isError){
        toast.error("Course Creation Failed")
    }
  },[isSuccess, error])

  return (
    <div className="flex-1 max-w-3xl mx-auto py-10 px-4 md:px-6 lg:px-8">
  <div className="mb-8">
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
      Add a New Course
    </h1>
    <p className="mt-2 text-sm text-gray-500">
      Provide basic details to create your course and get started quickly.
    </p>
  </div>

  <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border">
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-sm font-medium">Course Title</Label>
        <Input
          id="title"
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Enter your course name"
          className="w-full"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category" className="text-sm font-medium">Course Category</Label>
        <Select onValueChange={getSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="Next JS">Next JS</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Frontend Development">Frontend Development</SelectItem>
              <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
              <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
              <SelectItem value="Javascript">Javascript</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="Docker">Docker</SelectItem>
              <SelectItem value="MongoDB">MongoDB</SelectItem>
              <SelectItem value="HTML">HTML</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="outline"
        onClick={() => navigate("/admin/course")}
        className="rounded-xl"
      >
        Back
      </Button>
      <Button
        onClick={createCourseHandler}
        disabled={isLoading}
        className="rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Course"
        )}
      </Button>
    </div>
  </div>
</div>

  );
};

export default AddCourse;