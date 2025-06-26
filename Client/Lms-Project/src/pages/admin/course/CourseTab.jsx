import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  const courseId = params.courseId;
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    isSuccess: courseispassed,
    refetch,
  } = useGetCourseByIdQuery(courseId);
  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseispassed]);
  const [showAIHelper, setShowAIHelper] = useState(false);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };
  const [publishCourse, {}] = usePublishCourseMutation();

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        console.log(response);
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  };
  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ formData, courseId });
    refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated.");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course");
    }
  }, [isSuccess, error]);
  const [
    removecourse,
    {
      data: removecoursedata,
      isLoading: removecourseloading,
      isSuccess: removecoursesuccess,
    },
  ] = useRemoveCourseMutation();
  const removecoursehandler = async () => {
    const response = await removecourse({ courseId });
    console.log(response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      navigate("/admin/course");
    } else {
      toast.error(response?.error?.data?.message || "Failed to remove course");
    }
  };
  const generateCourseDescription = async (title) => {
    try {
      const API_KEY = "AIzaSyCw8qpsZ-lOGYeN1yW2cPRU0h4XiIXiWIg";
      const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const body = {
        contents: [
          {
            parts: [
              {
                text: `Suggest a professional course description for a course titled "${title} and give a proper crisp description two deploy on a website not more than 200 words.".`,
              },
            ],
          },
        ],
      };

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI";

      setInput((prev) => ({ ...prev, description: aiText }));
      toast.success("AI-generated description added.");
    } catch (err) {
      console.error("Gemini Error:", err);
      toast.error("Failed to get response from AI.");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-lg border border-gray-200">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
        <div>
          {/* <CardTitle className="text-2xl font-bold text-gray-800">Basic Course Information</CardTitle> */}
          <CardDescription className="text-sm text-gray-500">
            Make changes to your course here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            variant="outline"
            className="cursor-pointer"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            className="cursor-pointer"
            onClick={removecoursehandler}
            variant="destructive"
          >
            Remove Course
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Developer"
              className="w-full border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Subtitle
            </Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Learn Fullstack Development in 2 months"
              className="w-full border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
             type="text"
             name="description"
             value={input.description}
             onChange={changeEventHandler}
             placeholder="Describe the course"
             className="w-full border-gray-300"/>
           
            <Button
              variant="outline"
              size="sm"
              className="mt-2 flex text-left"
              onClick={() => {
                if (input.courseTitle.trim() === "") {
                  toast.error("Please enter a course title first.");
                  return;
                }
                setShowAIHelper(true);
                generateCourseDescription(input.courseTitle);
              }}
            >
              Get Help from AI
            </Button>

           
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Course Level
              </Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Price (INR)
              </Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-full border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Course Thumbnail
            </Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="h-40 mt-2 rounded-md border shadow-sm"
                alt="Course Thumbnail"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
