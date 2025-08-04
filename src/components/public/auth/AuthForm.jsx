import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { loginSchool } from "@/services/school.service";
import { ChevronRight, LogIn, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  //  UTILITY FUNCTIONS
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const school = await loginSchool(user);
      if (school.success) {
        navigate("/school/");
      }
      handleClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleClear = () => {
    setUser({ username: "", password: "" });
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
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user.username}
                  onChange={handleChange}
                  type={"text"}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={user.password}
                  onChange={handleChange}
                  type={"password"}
                />
                <p className="text-right text-red-500 underline">
                  forgot password?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center justify-end px-4 py-2">
              <Button
                type="submit"
                onClick={handleSubmit}
                className={"w-full py-6"}
              >
                <span>
                  <LogIn />
                </span>
                Login
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
