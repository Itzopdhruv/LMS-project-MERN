import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {Login} from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes";
import Profile from "./pages/student/Profile";
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
            {/* <Courses /> */}
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
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
           </ProtectedRoute>
        ),
      },
    ],
  },
]);


function App() {
  console.log("Hello");
  return (
    <main>
      
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App
