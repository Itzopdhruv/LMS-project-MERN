import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {Login} from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ui/ThemeProvider";
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
          // <AuthenticatedUser>
          <Login />
          // </AuthenticatedUser>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App
