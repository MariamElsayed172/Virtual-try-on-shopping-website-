import axios from "axios";
import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContextProvider";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;

  async function GetCart() {
    if (!token) return { data: { cart: { products: [] } } };
    try {
      return await axios.get("https://e-prova.vercel.app/Cart/get-cart", {
        headers: {
          token,
        },
      });
    } catch (error) {
      return { data: { cart: { products: [] } } };
    }
  }

  async function AddCart(productId, quantity, size, color) {
    if (!token) return { data: { message: "Please login to add to cart" } };
    try {
      const response = await axios.post(
        "https://e-prova.vercel.app/Cart/add-cart",
        {
          productId,
          quantity,
          size,
          color
        },
        { headers: { token } }
      );
      return toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      return { data: { message: error.response.data.message } };
    }
  }

  async function RemoveFromCart(productId) {
    if (!token)
      return { data: { message: "Please login to remove from cart" } };
    try {
      const response = await axios.patch(
        `https://e-prova.vercel.app/Cart/remove-from-cart`,
        { productId },
        { headers: { token } }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return { data: { message: error.response.data.message } };
    }
  }

  async function ClearCart() {
    if (!token) return { data: { message: "Please login to clear cart" } };
    try {
      const response = await axios.put(
        "https://e-prova.vercel.app/Cart/clear-cart",
        {},
        { headers: { token } }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return { data: { message: error.response.data.message } };
    }
  }

  async function UpdateCart(productId, quantity) {
    if (!token) return { data: { message: "Please login to update cart" } };
    try {
      const response = await axios.patch(
        "https://e-prova.vercel.app/Cart/update-cart",
        {
          productId,
          quantity,
        },
        { headers: { token } }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return { data: { message: error.response.data.message } };
    }
  }

  return (
    <CartContext.Provider
      value={{ GetCart, AddCart, RemoveFromCart, ClearCart, UpdateCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
