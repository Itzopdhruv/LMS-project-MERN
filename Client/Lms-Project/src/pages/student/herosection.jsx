import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full min-w-full overflow-x-hidden bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-10 text-lg">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <form className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 rounded-full shadow-lg max-w-2xl mx-auto mb-6 overflow-hidden">
          <Input
            type="text"
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 w-full sm:w-auto rounded-none sm:rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Search
          </Button>
        </form>

        <Button className="bg-white dark:bg-gray-800 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition">
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
