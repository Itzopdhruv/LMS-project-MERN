import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function Login() {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
   const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
   const handleRegistration = (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    console.log(inputData);
    // const action = type === "signup" ? registerUser : loginUser;
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Tabs defaultValue="Login" className="w-full max-w-md">
        <TabsList className="bg-gray-100 rounded-xl p-1 mb-4 shadow-sm w-full justify-center">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>

        {/* Signup Form */}
        <TabsContent value="signup">
         <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-xl border border-gray-200 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name"   name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")} type="text" placeholder="Eg. abc" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")} placeholder="Eg. abc@gmail.com" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password"   name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")} type="password" placeholder="Eg. abc@123" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleRegistration("signup")} className="w-full cursor-pointer font-bold">Signup</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login Form */}
        <TabsContent value="Login">
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-xl border border-gray-200 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email"   name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")} placeholder="Eg. abc@gmail.com" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" name="password"
                  value={loginInput.password}    onChange={(e) => changeInputHandler(e, "login")} placeholder="Eg. abc@123" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleRegistration("login")} className="w-full cursor-pointer font-bold">Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
