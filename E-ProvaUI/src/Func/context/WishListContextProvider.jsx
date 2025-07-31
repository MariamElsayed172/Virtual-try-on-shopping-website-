import axios from "axios";
import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContextProvider";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const WishListContext = createContext();

export const WishListContextProvider = ({ children }) => {
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;
  const queryClient = useQueryClient();

  async function GetWishList() {
    if (!token) return { data: { wishList: { products: [] } } };
    try {
      return await axios.get(
        "https://e-prova.vercel.app/WishList/getWishList",
        {
          headers: {
            token,
          },
        }
      );
    } catch (error) {
      return { data: { wishList: { products: [] } } };
    }
  }

  async function AddToWishList(productsId) {
    if (!token) {
      toast.error("Please login to add items to your wishlist");
      return;
    }
    try {
      const response = await axios.post(
        "https://e-prova.vercel.app/WishList/add",
        { productsId },
        {
          headers: {
            token,
          },
        }
      );
      toast.success("Item added to wishlist");
      queryClient.invalidateQueries(["WishList"]);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function RemoveFromWishList(productsId) {
    if (!token) {
      toast.error("Please login to remove items from your wishlist");
      return;
    }
    try {
      const response = await axios.delete(
        "https://e-prova.vercel.app/WishList/delete-product",
        {
          headers: {
            token,
          },
          data: { productsId }
        }
      );
      toast.success("Item removed from wishlist");
      queryClient.invalidateQueries(["WishList"]);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function ClearWishList() {
    if (!token) {
      toast.error("Please login to clear your wishlist");
      return;
    }
    try {
      const response = await axios.delete(
        "https://e-prova.vercel.app/WishList/delete-allProducts",
        {
          headers: {
            token,
          },
        }
      );
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries(["WishList"]);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <WishListContext.Provider value={{ GetWishList, AddToWishList, RemoveFromWishList, ClearWishList }}>
      {children}
    </WishListContext.Provider>
  );
};
