import { createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";


export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const logout = () => {
    removeCookie("accessToken", { path: "/" });
    window.sessionStorage.clear();
  };

  async function Register(username, email, password, confirmPassword, gender) {
    try {
      const { data } = await axios.post(
        "https://e-prova.vercel.app/auth/register",
        {
          username,
          email,
          password,
          confirmPassword,
          gender,
        }
      );
      toast.success(data.message, "then go to login", { duration: 2000 });
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      const RegisterErr = error.response;
      return RegisterErr;
    }
  }
  async function Login(email, password) {
    try {
      const { data } = await axios.post(
        "https://e-prova.vercel.app/auth/login",
        {
          email,
          password,
        }
      );
      toast.success(data.message);
      setCookie("accessToken", data.accessToken, {
        path: "/",
        maxAge: 86400,
      });
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      const LoginErr = error.response;
      return LoginErr;
    }
  }

  async function ForgetPassword(email) {
    try {
      const { data } = await axios.post(
        "https://e-prova.vercel.app/auth/forget-code",
        {
          email,
        }
      );
      toast.success(data.message);
      return data;
    } catch (error) {
      const errorF = error;
      toast.error(error.response.data.message);
      return errorF;
    }
  }

  async function ResetCode(email, code, password, confirmPassword) {
    try {
      const { data } = await axios.post(
        "https://e-prova.vercel.app/auth/reset-password",
        {
          email,
          code,
          password,
          confirmPassword,
        }
      );
      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      return error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ Register, Login, ForgetPassword, ResetCode, cookies, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
