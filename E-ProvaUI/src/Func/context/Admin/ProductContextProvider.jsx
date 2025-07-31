import axios from "axios";
import { createContext, useContext } from "react";
import { AuthContext } from "../AuthContextProvider";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

export const ProductContext = createContext();
export const ProductContextProvider = ({ children }) => {
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;

  // Get all products 
  async function GetProduct(sort = "") {
    try {
      const url = sort 
        ? `https://e-prova.vercel.app/Product?sort=${sort}`
        : "https://e-prova.vercel.app/Product";
      return await axios.get(url);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // get product by category id
  async function GetProductsByCategoryId(categoryId) {
    try {
      const response = await axios.get(`https://e-prova.vercel.app/Product?category=${categoryId}`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // get product by brand id
  async function GetProductsByBrandId(brandId) {
    try {
      const response = await axios.get(`https://e-prova.vercel.app/Product?brand=${brandId}`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Get paginated products with optional sorting
  async function GetPaginatedProducts(page = 1, sort = "") {
    try {
      let url = `https://e-prova.vercel.app/Product?page=${page}`;
      if (sort) {
        url += `&sort=${sort}`;
      }
      return await axios.get(url);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Get sorted products by price (ascending or descending)
  async function GetSortedProductsByPrice(ascending = true) {
    try {
      const sortOrder = ascending ? "price" : "-price";
      return await axios.get(`https://e-prova.vercel.app/Product?sort=${sortOrder}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function DeleteProduct(id) {
    try {
      const response = await axios.delete(
        `https://e-prova.vercel.app/Product/delete-product/${id}`,
        {
          headers: { token },
        }
      );
      console.log("🚀 ~ DeleteProduct ~ response:", response)
      toast.success(response.data.message);
      return response;
    } catch (error) {
      console.log("🚀 ~ DeleteProduct ~ error:", error)
      toast.error(error.message);
    }
  }

  return (
    <ProductContext.Provider value={{ 
      GetProduct, 
      GetPaginatedProducts, 
      DeleteProduct, 
      GetProductsByCategoryId, 
      GetProductsByBrandId,
      GetSortedProductsByPrice 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

ProductContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
