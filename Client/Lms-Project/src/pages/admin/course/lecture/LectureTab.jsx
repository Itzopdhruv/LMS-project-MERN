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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "https://lms-project-mern-backend.onrender.com/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData, refetch } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture?.lectureTitle);
      setIsFree(Boolean(lecture.isPreviewFree));
      setUploadVideoInfo({
        videoUrl: lecture?.videoUrl,
        publicId: lecture?.publicId,
      });
       console.log(lecture?.videoUrl,lecture?.publicId);
      //    if (lecture?.videoInfo?.videoUrl) {
      //   setBtnDisable(false); // ✅ Enable button if video exists
      // }
    }
  }, [lecture, lectureId])
  useEffect(() => {
    refetch();
  }, [lectureId]);
  useEffect(() => {
    if (lecture?.uploadVideInfo?.videoUrl) {
      setBtnDisable(false);
    }
  }, [lecture]);


  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ IMPORTANT!
          },
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideInfo, isFree, courseId, lectureId });

    await editLecture({
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
    // refetch()
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
    navigate(`/admin/course/${courseId}/lecture`);

  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      refetch();
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
    }
  }, [removeSuccess])
  const navigate = useNavigate();
  return (
    <Card className="max-w-3xl mx-auto border rounded-2xl shadow-md dark:border-neutral-800">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-2xl text-left font-semibold tracking-tight">
            Edit Lecture
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button
          onClick={removeLectureHandler}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">
            Title
          </Label>
          <Input
            id="title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Ex. Introduction to Javascript"
            className="text-sm"
          />
        </div>

        {/* Upload Video */}
        <div className="space-y-2">
          <Label htmlFor="video" className="text-base font-medium">
            Upload Video <span className="text-red-500">*</span>
          </Label>

          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-full sm:w-fit"
          // force re-render if video changed
          />

          {/* Show already uploaded video */}
          {uploadVideInfo?.videoUrl && (
            <p className="text-sm text-muted-foreground flex">
              Current Video: {" "}
              <a
                href={uploadVideInfo?.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline ml-2 text-left"
              >
                View uploaded video
              </a>
            </p>
          )}
        </div>

        {/* Switch */}
        <div className="flex items-center gap-3 mt-4">
          <Switch
            id="isFree"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="isFree" className="text-sm">
            This video is <span className="font-medium">Free Preview</span>
          </Label>
        </div>

        {/* Upload Progress */}
        {mediaProgress && (
          <div className="space-y-1">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        {/* Update Button */}
        <div className="pt-2 flex cursor-pointer">
          <Button
            onClick={editLectureHandler}
            disabled={isLoading}
            className="w-full sm:w-auto cursor-pointer "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>

  );
};

export default LectureTab;
