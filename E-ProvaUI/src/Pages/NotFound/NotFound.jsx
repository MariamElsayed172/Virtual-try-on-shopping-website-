import { Link } from "react-router";
import img from "../../../public/Notfound/undraw_empty_4zx0.svg";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 md:px-12">
      <div className="text-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto">
          <img
            src={img}
            alt="Not Found"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black mt-6">
          Page Not Found
        </h1>

        <p className="text-base sm:text-lg mt-4 text-gray-500">
          We’re sorry — something has gone wrong on our end.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/e-prova/home"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Go Back Home
          </Link>
          <Link
            to="/e-prova/login"
            className="rounded-md bg-gray-600 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
