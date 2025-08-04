import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { publicMenuItems } from "@/utils/publicNavigation";
import { Link } from "react-router-dom";
import { AuthForm } from "../../auth/AuthForm";

const LargeHeader = () => {
  return (
    <header className="bg-red-700 w-full text-white md:block hidden">
      <div className="flex items-center justify-between py-4 w-5/6 mx-auto">
        <h1 className="font-semibold text-lg">School - MS</h1>
        <nav className="flex items-center space-x-4">
          <NavigationMenu className={"flex space-x-8"}>
            {publicMenuItems.map((item) => (
              <NavigationMenuLink
                key={item.title}
                className={"hover:underline hover:text-black"}
                asChild
              >
                <Link to={item.path}>{item.title}</Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenu>
          <AuthForm />
        </nav>
      </div>
    </header>
  );
};

export default LargeHeader;
