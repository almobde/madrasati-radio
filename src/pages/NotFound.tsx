import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-gray-600">عذراً! الصفحة غير موجودة</p>
          <a href="/" className="text-blue-500 underline hover:text-blue-700">
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
