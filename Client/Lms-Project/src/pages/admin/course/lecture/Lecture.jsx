import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-[#1F1F1F] px-5 py-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
          Lecture {index + 1}:{" "}
          <span className="font-normal text-gray-600 dark:text-gray-300">
            {lecture.lectureTitle}
          </span>
        </h2>
      </div>
      <button
        onClick={goToUpdateLecture}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Edit Lecture"
      >
        <Edit
          size={20}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        />
      </button>
    </div>
  );
};

export default Lecture;
