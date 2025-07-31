import axios from "axios";
import { createContext, useContext } from "react";
import { AuthContext } from "../AuthContextProvider";
import toast from "react-hot-toast";
  
  export const BrandContext = createContext();
  export const BrandContextProvider = ({ children }) => {
    const { cookies } = useContext(AuthContext);
    const token = cookies.accessToken;
    async function GetBrand() {
      try {
        return await axios.get("https://e-prova.vercel.app/Brand/all-brand")
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    async function CreateBrand(img, name, categoryIds) {
      try {
        const formData = new FormData();
        formData.append("brand", img);
        formData.append("name", name);
    
        categoryIds.forEach((id, index) => {
          formData.append(`categories[${index}]`, id);
        });
    
        return await axios.post("https://e-prova.vercel.app/Brand/create-brand", formData, {
          headers: {
            token,
          },
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
    
    

    async function UpdateBrand(id, { name, brand } = {}) {
      const formData = new FormData();
      formData.append("name", name);
      if (brand instanceof File) {
        formData.append("brand", brand);
      }
      
      try {
        const response = await axios.patch(
          `https://e-prova.vercel.app/Brand/update-brand/${id}`,
          formData,
          {
            headers: {
              token,
            },
          }
        );
        toast.success("Brand updated successfully");
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

    return (
      <BrandContext.Provider value={{ GetBrand, CreateBrand, UpdateBrand }}>
        {children}
      </BrandContext.Provider>
    );
  };
