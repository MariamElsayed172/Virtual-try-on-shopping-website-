import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { Register } = useContext(AuthContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name must be at most 20 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .lowercase(),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await Register(
          values.name,
          values.email,
          values.password,
          values.confirmPassword,
          values.gender
        );
        if (res.success) {
          navigate("/e-prova/login");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <main className="my-10 font-sans">
        <div className="overflow-hidden block">
          <section className="relative mb-10 lg:mb-52 md:mt-32">
            <div className="relative block">
              <h1 className=" text-center font-sans font-semibold text-2xl  text-[#181818] mb-1 relative leading-normal block md:text-3xl">
                CREATE ACCOUNT
              </h1>
              <ol className="justify-center bg-white m-0 p-0 relative z-0 flex flex-wrap list-none rounded">
                <li className="mr-3.5 pr-2.5 relative  before:w-1 before:h-1 before:rotate-45 before:absolute before:-right-1 before:top-1/2 before:rounded-sm before:bg-[#222]">
                  <Link
                    to="/e-prova/home"
                    className=" text-xs font-light text-[#222]"
                  >
                    Home
                  </Link>
                </li>
                <li className="inline-block">
                  <span className=" text-xs font-medium text-[#222]">
                    Create Account
                  </span>
                </li>
              </ol>
            </div>
          </section>
          <div className="pb-[30px] flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/2">
              <div className="">
                <form onSubmit={formik.handleSubmit} className="w-full">
                  <div className="mb-[15px]">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-black"
                    >
                      Name
                    </label>
                    <input
                      className="border outline-none border-gray-200 hover:border-[#e94328] px-5 h-[50px] w-full rounded-3xl font-sans text-xs font-medium inline-block"
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.name && formik.touched.name && (
                      <p className="text-sm text-red-500">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

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
                      htmlFor="passwordConfirmation"
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
                          showPassword ? "fa-eye-slash" : "fa-eye"
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

                  <div>
                    <select
                      name="gender"
                      id="gender"
                      className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" disabled>
                        Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {formik.errors.gender && formik.touched.gender && (
                      <p className="text-sm text-red-500">
                        {formik.errors.gender}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center mt-5 mb-[15px]">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        className="rounded border-gray-300 text-[#e94328] focus:ring-[#e94328]"
                      />
                      <label
                        htmlFor="newsletter"
                        className="text-xs text-[#181818]"
                      >
                        Sign up for our newsletter
                      </label>
                    </div>
                  </div>
                  <div className="font-sans font-normal text-xs mx-0 mt-3 mb-5">
                    <p>
                      If you have an account, please{" "}
                      <Link
                        to="/e-prova/login"
                        className="font-sans font-regular text-xs text-[#6aa1da] hover:text-[#e94328] duration-0"
                      >
                        Login Here
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
                      "Register"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
