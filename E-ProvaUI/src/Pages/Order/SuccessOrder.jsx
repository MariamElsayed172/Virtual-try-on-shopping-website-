import { Link } from "react-router";
import logo from "../../assets/undraw_order-confirmed_m9e9.svg";

export default function SuccessOrder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 md:px-12">
      <div className="text-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto">
          <img
            src={logo}
            alt="Order Success"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black mt-6">
          Order Success
        </h1>

        <p className="text-base sm:text-lg mt-4 text-gray-500">
          Your order has been successfully placed. We will process your order as
          soon as possible. Thank you for shopping with us.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/e-prova/home"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Go Back Home
          </Link>
          <Link
            to="/e-prova/products"
            className="rounded-md bg-gray-600 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            Shop More Products
          </Link>
        </div>
      </div>
    </div>
  );
}