import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import Sidebar from "./pages/admin/course/lecture/sidebar";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ui/ThemeProvider";
// import { AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes";
import Profile from "./pages/student/Profile";
import Dashboard from "./pages/admin/DashBoard";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import CourseTable from "./pages/admin/course/coursetable";
import AddCourse from "./pages/admin/course/Addcourse";
import EditCourse from "./pages/admin/course/Editcourse";
import CreateLecture from "./pages/admin/course/lecture/Createlecture";
import EditLecture from "./pages/admin/course/lecture/Editlecture";
import SearchPage from "./pages/student/searchpage";
import CourseDetail from "./pages/student/CourseDetail";
import Courseprogress from "./pages/student/courseprogress";
import { AuthenticatedUser,ProtectedRoute,AdminRoute } from "./components/ui/ProtectRoute";
import PurchaseCourseProtectedRoute from "./components/ui/Purchasecontrolroute";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute><MyLearning /></ProtectedRoute>

          // </AuthenticatedUser>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },


        ]
      },
      {
        path: "course-detail/:courseId",

        element:
          <ProtectedRoute> 
           <CourseDetail/>
          </ProtectedRoute>
      },
      {
        path: "course-progress/:courseId",
        element:
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <Courseprogress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
      },

    ],
  },
]);


function App() {
  console.log("Hello");
  return (
    <div className="w-full">
    <ThemeProvider><RouterProvider router={appRouter} /></ThemeProvider>
      
    </div>
  )
}

export default App
