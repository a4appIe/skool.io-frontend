import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import axios from "axios";

const token = localStorage.getItem("token");
axios.interceptors.request.use(
  (request) => {
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <StrictMode> */}
      <App />
      <Toaster
        toastOptions={{
          classNames: {
            toast:
              "bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg",
            success: "bg-green-700",
            error: "bg-red-700",
            warning: "bg-yellow-600 text-black",
            info: "bg-gray-800",
            title: "text-white font-semibold",
            description: "text-gray-300",
          },
        }}
        duration={2000}
        richColors
        position="top-right"
      />
    {/* </StrictMode> */}
  </BrowserRouter>
);
