import { useContext, useState } from "react";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom"; // Fixed the import path
import HedearSection from "./HedearSection";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function RsetCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { ResetCode } = useContext(AuthContext); 

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .lowercase(),
      code: Yup.string().required("Code is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await ResetCode(
          values.email,
          values.code,
          values.password,
          values.confirmPassword
        );
        if (res.success) {
          navigate("/e-prova/login");
        }
      } catch (error) {
      console.log("🚀 ~ onSubmit: ~ error:", error)
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="my-40">
      <HedearSection />
      <div className="pb-44">
        <div className="justify-center flex flex-wrap">
          <div className="lg:w-1/2 lg:mx-auto sm:w-full justify-center flex">
            <form
              onSubmit={formik.handleSubmit} // Fixed the form submission
              className="md:w-2/3 lg:w-full"
            >
              <h1 className="font-sans font-bold text-xs md:text-lg lg:text-sm text-[#181818]">
                Reset your password
              </h1>
              <hr className="my-2 border-t-2 border-[#8486e2] w-1/2 md:w-2/3 sm:w-1/2 lg:w-1/3" />
              <div className="mb-[15px]">
                <p className="text-xs font-normal mb-[15px] text-gray-500">
                  We sent you a code to your email to reset your password.
                </p>
                <div className="mb-[15px]">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email
                  </label>
                  <input
                    className="border outline-none border-gray-200 hover:border-[#e94328] px-5 h-[50px] w-full rounded-3xl font-sans text-xs font-medium inline-block"
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
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-black"
                >
                  Code
                </label>
                <input
                  className="border outline-none border-gray-200 hover:border-[#e94328] px-5 py-0 h-[50px] w-full mb-0 rounded-3xl font-sans text-xs font-medium inline-block max-w-full leading-5 overflow-x-hidden overflow-y-auto"
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Enter your code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.errors.code && formik.touched.code && (
                  <p className="text-sm text-red-500">{formik.errors.code}</p>
                )}
                <div className="relative mb-[15px]">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    className="border outline-none border-gray-200 hover:border-[#e94328] px-5 h-[50px] w-full rounded-3xl font-sans text-xs font-medium inline-block"
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
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
                <div className="relative mb-[15px]">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-black"
                  >
                    Password Confirmation
                  </label>
                  <input
                    className="border outline-none border-gray-200 hover:border-[#e94328] px-5 h-[50px] w-full rounded-3xl font-sans text-xs font-medium inline-block"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="PASSWORD CONFIRMATION"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  <div
                    className="block absolute bottom-px right-px px-4 py-0.5 leading-10 cursor-pointer"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      } fa-xs text-[#7c7e83] hover:text-black`}
                    ></i>
                  </div>
                  {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>
              <div className="flex justify-start gap-5 uppercase">
                <button
                  type="submit"
                  className="px-8 py-3 text-white bg-[#181818] hover:bg-[#0b0b0b] font-sans rounded-3xl text-xs font-medium text-center"
                  disabled={isLoading}
                >
                  {isLoading ? <PacmanLoader color="#fff" size={10} /> : "SUBMIT"}
                </button>
                <Link to="/e-prova/forgotpassword">
                  <button
                    type="button"
                    className="px-8 py-3 text-white bg-[#181818] hover:bg-[#0b0b0b] font-sans rounded-3xl text-xs font-medium text-center"
                  >
                    BACK
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

