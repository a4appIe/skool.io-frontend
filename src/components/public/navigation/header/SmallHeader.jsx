import React from "react";
import { AuthForm } from "../../auth/AuthForm";
import MobileMenu from "./MobileMenu";

const SmallHeader = () => {
  return (
    <div>
      <header className="bg-red-700 w-full text-white md:hidden block">
        <div className="flex items-center justify-between py-4 w-5/6 mx-auto">
          <h1 className="font-semibold text-lg">School - MS</h1>
          <nav className="flex items-center space-x-4">
            <AuthForm />
            <MobileMenu />
          </nav>
        </div>
      </header>
    </div>
  );
};

export default SmallHeader;
