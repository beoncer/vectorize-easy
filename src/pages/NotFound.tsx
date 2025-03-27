
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-6">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-9xl font-bold text-tovector-red mb-4">404</h1>
          <div className="absolute w-full h-4 bg-tovector-red/20 bottom-10 left-0 animate-pulse"></div>
        </div>
        
        <p className="text-2xl mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        
        <Link to="/" className="btn-primary inline-flex items-center">
          Return to Home
          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
