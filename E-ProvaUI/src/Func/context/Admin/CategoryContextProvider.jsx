import axios from "axios";
import { createContext, useContext } from "react";
import { AuthContext } from "../AuthContextProvider";
import toast from "react-hot-toast";

export const CategoryContext = createContext();
export const CategoryContextProvider = ({ children }) => {
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;

  
  async function GetCategory() {
    try {
      return await axios.get("https://e-prova.vercel.app/Category/categories");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function DeleteCategory(id) {
    try {
      return await axios.delete(
        `https://e-prova.vercel.app/Category/delete-category/${id}`,
        {
          headers: { token },
        }
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function CreateCategory(name, description, gender) {

    try {
      const response = await axios.post(
        "https://e-prova.vercel.app/Category/create-category",
        { name, description, gender },
        {
          headers: {
            token,
          },
        }
      );
      toast.success("Category created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function UpdateCategory(id, { name, description, gender } = {}) {
    try {
      const response = await axios.patch(
        `https://e-prova.vercel.app/Category/update-category/${id}`,
        {
            name,
            description,
            gender
        },
        {
          headers: {
            token,
          },
        }
      );
      toast.success("Category updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <CategoryContext.Provider
      value={{ GetCategory, DeleteCategory, CreateCategory, UpdateCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
