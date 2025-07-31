import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HedearSection from "./HedearSection";
import { useFormik } from "formik";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import * as Yup from "yup";
import { PacmanLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { Login } = useContext(AuthContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .lowercase(),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await Login(values.email, values.password);
        if (res.success) {
          const { role } = jwtDecode(res.accessToken); // Assuming you have a function to decode JWT
          if (role === "admin") {
            navigate("/e-prova/admin");
          } else {
            navigate("/e-prova/home");
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <main className="my-10">
      <div className="overflow-hidden block">
        <HedearSection />
        <div className="pb-[30px] w-full min-w-full px-[15px] block">
          <div className="justify-center flex flex-wrap -mx-[15px]">
            <div className="lg:w-1/2 lg:mx-auto sm:w-full justify-center flex flex-wrap -mx-[15px]">
              <form
                onSubmit={formik.handleSubmit}
                className="block mt-0 lg:w-full"
              >
                <h1 className="font-sans font-semibold text-xl md:text-3xl text-[#181818] lg:w-full lg:text-2xl">
                  SIGN IN
                </h1>
                <p className="text-xs font-normal mb-[15px] text-[#181818]">
                  Insert your account information:
                </p>
                <div className="mb-[15px]">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email
                  </label>
                  <input
                    className="border outline-none border-gray-200 hover:border-[#e94328] px-5 py-0 h-[50px] w-full mb-0 rounded-3xl font-sans text-xs font-medium inline-block max-w-full leading-5 overflow-x-hidden overflow-y-auto"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="text-sm text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div className="relative mb-[15px]">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    className="border outline-none border-gray-200  hover:border-[#e94328] px-5 py-0 h-[50px] w-full mb-0 rounded-3xl font-sans text-xs font-medium inline-block max-w-full leading-5 overflow-x-hidden overflow-y-auto"
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    id="password"
                    name="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div
                    className="block absolute bottom-px right-px px-4 py-0.5 leading-10 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } fa-xs text-[#7c7e83] hover:text-black`}
                    ></i>
                  </div>
                  {formik.errors.password && formik.touched.password && (
                    <p className="text-sm text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-5 mb-[15px] font-medium">
                  <i className="mr-2 mt-1 text-base inline-block fa-solid fa-envelope fa-sm text-[#e94328]"></i>
                  <Link
                    to="/e-prova/forgotpassword"
                    className="text-xs text-[#181818] duration-0"
                  >
                    Forgot your{" "}
                    <strong className="font-bold hover:text-[#e94328]">
                      Password ?
                    </strong>
                  </Link>
                </div>
                <div className="font-sans font-normal text-xs mx-0 mt-3 mb-5">
                  <p className="text-xs">
                    If you do not have an account, please{" "}
                    <Link
                      to="/e-prova/register"
                      className="font-sans font-regular text-xs text-[#6aa1da] hover:text-[#e94328] duration-0"
                    >
                      Register Here
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className={`w-full min-w-[clamp(60px,140px,140px)] h-10 px-5 py-0 text-white bg-[#181818] hover:bg-[#0b0b0b] font-sans rounded-3xl font-semibold text-xs text-center ${
                    isLoading ? "cursor-wait" : "cursor-pointer"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <PacmanLoader color="#fff" size={10} />
                  ) : (
                    "LOGIN"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

