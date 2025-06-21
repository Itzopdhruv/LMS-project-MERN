import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    useCreateLectureMutation,
    useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const [createLecture, { data, isLoading, isSuccess, error }] =
        useCreateLectureMutation();

    const {
        data: lectureData,
        isLoading: lectureLoading,
        isError: lectureError,
        refetch,
    } = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message);
            setLectureTitle("");
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error]);

    return (
        <div className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="mb-8 space-y-1">
                <h1 className="text-2xl font-bold text-gray-800">
                    Add Lectures to Your Course
                </h1>
                <p className="text-gray-500 text-sm">
                    Fill in the title below to create a new lecture.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
                <div>
                    <Label className="text-sm text-gray-700 font-semibold mb-4">Lecture Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Enter lecture title"
                        className="mt-1"
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/admin/course/${courseId}`)}
                        className="rounded-lg"
                    >
                        Back to Course
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={createLectureHandler}
                        className="rounded-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Create Lecture"
                        )}
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Existing Lectures
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    {lectureLoading ? (
                        <p className="text-gray-500">Loading lectures...</p>
                    ) : lectureError ? (
                        <p className="text-red-500">Failed to load lectures.</p>
                    ) : lectureData.lectures.length === 0 ? (
                        <p className="text-gray-500">No lectures available.</p>
                    ) : (
                        <div className="space-y-4">
                            {lectureData.lectures.map((lecture, index) => (
                                <Lecture
                                    key={lecture._id}
                                    lecture={lecture}
                                    courseId={courseId}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLecture;
