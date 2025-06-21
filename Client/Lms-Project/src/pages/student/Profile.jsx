import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const navigate = useNavigate();

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
      navigate("/");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1 className="text-center text-xl mt-10">Loading Profile...</h1>;

  const user = data && data.user;

  return (
    <div className="max-w-5xl mx-auto my-30 px-6 py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 flex items-center justify-center gap-2">
        <span className="text-4xl">👤</span> Your Profile
      </h1>

      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-32 w-32 border-4 border-indigo-500 shadow-md">
          <AvatarImage
            src={user?.photoUrl || "https://github.com/shadcn.png"}
            alt="User Avatar"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-sm mt-2 text-gray-500">Profile Photo</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
        <div className="text-center">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Name</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.name}</p>
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Email</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Role</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.role.toUpperCase()}</p>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6 py-2">
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Profile Photo</Label>
                <Input
                  onChange={onChangeHandler}
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={updateUserHandler}
                disabled={updateUserIsLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
              >
                {updateUserIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          📚 Enrolled Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user.enrolledCourses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              You haven't enrolled in any courses yet.
            </p>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
