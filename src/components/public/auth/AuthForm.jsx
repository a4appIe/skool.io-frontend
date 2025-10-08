import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { loginSchool } from "@/services/school.service";
import { loginStudent } from "@/services/student.service";
import { loginTeacher } from "@/services/teacher.service";
// import { loginTeacher } from "@/services/teacher.service";
import {
  ChevronRight,
  LogIn,
  LogOut,
  Sparkles,
  GraduationCap,
  Users,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AuthForm() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
    userType: "school", // Default to school
  });
  const navigate = useNavigate();

  // UTILITY FUNCTIONS
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleClear();
    setOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleUserTypeChange = (value) => {
    setUser((prev) => ({ ...prev, userType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!user.username.trim() || !user.password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    try {
      const credentials = {
        username: user.username,
        password: user.password,
      };

      let response;
      let redirectPath;

      // Call appropriate login API based on user type
      switch (user.userType) {
        case "student":
          response = await loginStudent(credentials);
          redirectPath = "/student";
          break;
        case "teacher":
          response = await loginTeacher(credentials);
          redirectPath = "/teacher";
          break;
        case "school":
        default:
          response = await loginSchool(credentials);
          redirectPath = "/school";
          break;
      }
      console.log(response);

      if (response?.success) {
        toast.success(`Welcome back, ${user.userType}!`);
        handleClose();
        return navigate(redirectPath);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleClear = () => {
    setUser({ username: "", password: "", userType: "school" });
  };

  return (
    <>
      <Sheet className="" open={open} onOpenChange={setOpen}>
        <Button
          className={"flex items-center space-x bg-black hover:bg-gray-900"}
          onClick={handleOpen}
        >
          <span className=" md:text-sm text-xs">Login</span>
          <span>
            <ChevronRight />
          </span>
        </Button>
        <SheetContent
          className={"[&>button.absolute]:hidden w-full md:w-[400px]"}
        >
          {/* Animated Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-red-700"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-white">
                    Login
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-sm">
                    Please enter your credentials
                  </SheetDescription>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              {/* User Type Selection */}
              <div className="grid gap-3">
                <Label>Login As</Label>
                <RadioGroup
                  value={user.userType}
                  onValueChange={handleUserTypeChange}
                  className="grid grid-cols-3 gap-3"
                >
                  {/* Student Option */}
                  <div>
                    <RadioGroupItem
                      value="student"
                      id="student"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-red-700 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all"
                    >
                      <GraduationCap
                        className={`h-6 w-6 mb-2 ${
                          user.userType === "student"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          user.userType === "student"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        Student
                      </span>
                    </Label>
                  </div>

                  {/* Teacher Option */}
                  <div>
                    <RadioGroupItem
                      value="teacher"
                      id="teacher"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="teacher"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-red-700 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all"
                    >
                      <Users
                        className={`h-6 w-6 mb-2 ${
                          user.userType === "teacher"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          user.userType === "teacher"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        Teacher
                      </span>
                    </Label>
                  </div>

                  {/* School Option */}
                  <div>
                    <RadioGroupItem
                      value="school"
                      id="school"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="school"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-red-700 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all"
                    >
                      <Building2
                        className={`h-6 w-6 mb-2 ${
                          user.userType === "school"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          user.userType === "school"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        School
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Username Field */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user.username}
                  onChange={handleChange}
                  type={"text"}
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={user.password}
                  onChange={handleChange}
                  type={"password"}
                  placeholder="Enter your password"
                />
                <p className="text-right text-red-500 underline text-sm cursor-pointer hover:text-red-600">
                  forgot password?
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 items-center justify-end px-4 py-2">
              <Button
                type="submit"
                onClick={handleSubmit}
                className={"w-full py-6 bg-red-700 hover:bg-red-800"}
              >
                <span>
                  <LogIn />
                </span>
                Login as{" "}
                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className={"w-full py-6"}
                >
                  <span>
                    <LogOut />
                  </span>
                  Close
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
