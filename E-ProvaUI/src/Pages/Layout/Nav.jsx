import img from "../../../public/Logo_Enhanced_resolution_mega.png";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { MdOutlineShoppingBasket } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";
import Search from "../../Components/Search";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { WishListContext } from "../../Func/context/WishListContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import { CartContext } from "../../Func/context/CartContextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Nav() {
  const { GetWishList } = useContext(WishListContext);
  const { GetCart, UpdateCart, RemoveFromCart, ClearCart } =
    useContext(CartContext);
  const { cookies, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [active, setActive] = useState("login");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [isClearingCart, setIsClearingCart] = useState(false);

  const { data } = useQuery({
    queryKey: ["WishList"],
    queryFn: () => GetWishList(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const { data: cart } = useQuery({
    queryKey: ["Cart"],
    queryFn: () => GetCart(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const handleLogout = () => {
    logout();
    navigate("/e-prova/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdateQuantity = async (productId, count) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }));
      await UpdateCart(productId, count);
      await queryClient.invalidateQueries({ queryKey: ["Cart"] });
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [productId]: true }));
      await RemoveFromCart(productId);
      await queryClient.invalidateQueries({ queryKey: ["Cart"] });
    } catch (error) {
      console.error("Error deleting from cart:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true);
      await ClearCart();
      await queryClient.invalidateQueries({ queryKey: ["Cart"] });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsClearingCart(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="bg-white shadow-md">
          <div
            className={`transition-all duration-1000 ${
              isScrolled ? "p-2" : "p-7"
            }`}
          >
            <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <IconButton
                    className="block lg:hidden text-gray-600 p-2 rounded-md hover:bg-gray-200"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <HiBars3CenterLeft size={20} />
                  </IconButton>
                  <button className="block lg:hidden text-gray-600 p-2 rounded-md hover:bg-gray-200 md:hidden">
                    <Search />
                  </button>

                  {/* Logo */}
                  <Link to="/e-prova/home" className="block">
                    <img
                      src={img}
                      alt="Logo"
                      className="w-28 h-20 mx-auto lg:mx-0"
                    />
                  </Link>
                </div>

                {/* Navigation Links */}
                <ul className="hidden xl:flex items-center gap-6 text-sm basis-auto xl:basis-96 xl:justify-end">
                  {[
                    "Home",
                    "NewArrivals",
                    "Products",
                    "Blog",
                    "Orders",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        className="text-gray-500 hover:text-gray-700 transition"
                        to={`/e-prova/${item.toLowerCase()}`}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Right Section: Icons & Buttons */}
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-4">
                    <Search />
                    {cookies.accessToken && (
                      <>
                        <Link to="/e-prova/wishlist">
                          <span className="relative inline-block">
                            <div className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md">
                              <CiStar
                                className="m-1 cursor-pointer "
                                size={20}
                              />
                              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {data?.data?.wishList?.products?.length || 0}
                              </span>
                            </div>
                          </span>
                        </Link>
                        <span className="relative inline-block">
                          <div
                            onClick={() => setIsCartDrawerOpen(true)}
                            className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md"
                          >
                            <MdOutlineShoppingBasket
                              className="m-1 cursor-pointer "
                              size={20}
                            ></MdOutlineShoppingBasket>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                              {cart?.data?.cart?.products?.length || 0}
                            </span>
                          </div>
                        </span>
                      </>
                    )}
                    {cookies.accessToken && (
                      <div
                        onClick={handleLogout}
                        className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md"
                      >
                        <IoMdLogOut className="m-1 cursor-pointer" size={20} />
                      </div>
                    )}
                  </div>

                  {/* Login & Register Buttons */}
                  <div className="hidden md:flex gap-2">
                    {!cookies.accessToken && (
                      <div className="relative w-52 h-12 bg-gray-100 rounded-full flex items-center p-1">
                        {/* Sliding Background */}
                        <div
                          className={`absolute left-1 top-1 bottom-1 w-24 rounded-full bg-white transition-all duration-300 ${
                            active === "register"
                              ? "translate-x-[100%]"
                              : "translate-x-0"
                          }`}
                        ></div>

                        <button
                          className={`w-1/2 text-center text-sm font-medium z-10 ${
                            active === "login" ? "text-black" : "text-gray-500"
                          }`}
                          onMouseEnter={() => setActive("login")}
                        >
                          <Link className="text-xs" to="/e-prova/login">
                            LOGIN
                          </Link>
                        </button>

                        {/* Register Button */}
                        <button
                          className={`w-1/2 text-center text-sm font-medium z-10 ${
                            active === "register"
                              ? "text-black"
                              : "text-gray-500"
                          }`}
                          onMouseEnter={() => setActive("register")}
                        >
                          <Link to="/e-prova/register" className="text-xs">
                            REGISTER
                          </Link>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Mobile Icons */}

                <span className="md:hidden lg:hidden flex gap-5">
                  {cookies.accessToken && (
                    <>
                      <Link to="/e-prova/wishlist">
                        <span className="relative inline-block">
                          <div className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md">
                            <CiStar className="m-1 cursor-pointer " size={20} />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                              {data?.data?.wishList?.products?.length || 0}
                            </span>
                          </div>
                        </span>
                      </Link>

                      <span className="relative inline-block mr-3">
                        <div
                          onClick={() => setIsCartDrawerOpen(true)}
                          className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md"
                        >
                          <MdOutlineShoppingBasket
                            className="m-1 cursor-pointer "
                            size={20}
                          ></MdOutlineShoppingBasket>
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {cart?.data?.cart?.products?.length || 0}
                          </span>
                        </div>
                      </span>
                    </>
                  )}
                </span>
              </div>

              {/* Drawer for Mobile Menu */}
              <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ sx: { width: "350px" } }}
              >
                <List>
                  <ListItem>
                      <Search />
                  </ListItem>

                  {["Home", "NewArrivals", "Products", "Wishlist", "Blog"].map(
                    (item) => (
                      <ListItem
                        button
                        key={item}
                        onClick={() => setIsDrawerOpen(false)}
                        component={Link}
                        to={`/e-prova/${item.toLowerCase()}`}
                        className="hover:text-red-600 transition"
                      >
                        <ListItemText primary={item} />
                      </ListItem>
                    )
                  )}
                  <ListItem>
                    {!cookies.accessToken && (
                      <>
                        <Link
                          to="/e-prova/login"
                          className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-black rounded-lg"
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </ListItem>
                  <ListItem>
                    {!cookies.accessToken && (
                      <Link
                        to="/e-prova/register"
                        className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#e94328] rounded-lg"
                      >
                        Register
                      </Link>
                    )}
                  </ListItem>
                  <ListItem>
                    <Typography variant="caption" className="font-light">
                      Call us: +20 (112) 0636239
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="caption" className="font-light">
                      Email:{" "}
                      <a href="mailto:marwanabdalrady13@gmail.com">
                        marwanabdalrady13@gmail.com
                      </a>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ul className="mt-8 flex justify-center items-center gap-10">
                      <li>
                        <a
                          href="https://www.facebook.com/mrwan.abdalrady.5"
                          rel="noreferrer"
                          target="_blank"
                          className="text-black transition hover:text-red-600 hover:bg-black hover:border-black border-2 rounded-full p-2"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/in/marwan-abdalrady-57b87b222/"
                          rel="noreferrer"
                          target="_blank"
                          className="text-black transition hover:text-red-600 hover:bg-black hover:border-black border-2 rounded-full p-2"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/MarwanabdalR"
                          rel="noreferrer"
                          target="_blank"
                          className="text-black transition hover:text-red-600 hover:bg-black hover:border-black border-2 rounded-full p-2"
                        >
                          <i className="fa-brands fa-github"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://protofolio-git-main-marwans-projects-3f5c5d0c.vercel.app/"
                          rel="noreferrer"
                          target="_blank"
                          className="text-black transition hover:text-red-600 hover:bg-black hover:border-black border-2 rounded-full p-2"
                        >
                          <i className="fa-solid fa-briefcase"></i>
                        </a>
                      </li>
                    </ul>
                  </ListItem>
                  <ListItem>
                    {cookies.accessToken && (
                      <div
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#e94328] rounded-lg cursor-pointer"
                      >
                        Logout
                      </div>
                    )}
                  </ListItem>
                </List>
              </Drawer>

              {/* Cart Drawer */}
              <Drawer
                anchor="right"
                open={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                PaperProps={{ sx: { width: "350px" } }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold">
                      Shopping Cart
                    </Typography>
                    <IconButton onClick={() => setIsCartDrawerOpen(false)}>
                      <i className="fas fa-times"></i>
                    </IconButton>
                  </div>
                  <Divider />

                  {cart?.data?.cart?.products?.length > 0 ? (
                    <>
                      <List>
                        {cart?.data?.cart?.products?.map((product) => (
                          <ListItem
                            key={product._id}
                            className="flex flex-col items-start p-4"
                          >
                            <div className="flex items-center w-full gap-4">
                              <img
                                src={product.productId.defaultImage.url}
                                alt={product.productId.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <Typography
                                  variant="subtitle1"
                                  className="font-medium"
                                >
                                  {product.productId.name}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Color:{" "}
                                  <span className="capitalize">
                                    {product.productId.attributes.color}
                                  </span>
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="font-bold"
                                >
                                  ${product.productId.finalPrice.toFixed(2)}
                                </Typography>
                              </div>
                              {/* Remove Button */}
                              <button
                                onClick={() =>
                                  handleRemoveFromCart(product.productId._id)
                                }
                                disabled={loadingStates[product.productId._id]}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {loadingStates[product.productId._id] ? (
                                  <AiOutlineLoading3Quarters
                                    className="animate-spin"
                                    size={20}
                                  />
                                ) : (
                                  <IoTrashOutline
                                    size={20}
                                    className="text-red-500"
                                  />
                                )}
                              </button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-4 self-center">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    product.productId._id,
                                    product.quantity - 1
                                  )
                                }
                                disabled={
                                  product.quantity <= 1 ||
                                  loadingStates[product.productId._id]
                                }
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="w-8 text-center">
                                {product.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    product.productId._id,
                                    product.quantity + 1
                                  )
                                }
                                disabled={loadingStates[product.productId._id]}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </ListItem>
                        ))}
                      </List>
                      <div className="mt-4">
                        <Divider />
                        <div className="flex justify-between items-center py-4">
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h6" className="font-bold">
                            ${cart?.data?.cart?.totalPrice.toFixed(2) || 0}
                          </Typography>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to="/e-prova/cart"
                            className="flex-1 px-4 py-2 text-center text-sm font-medium text-white bg-black rounded-lg"
                            onClick={() => setIsCartDrawerOpen(false)}
                          >
                            View Cart
                          </Link>
                          <button
                            onClick={handleClearCart}
                            disabled={isClearingCart}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isClearingCart ? (
                              <AiOutlineLoading3Quarters
                                className="animate-spin mx-auto"
                                size={20}
                              />
                            ) : (
                              "Clear All"
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Typography variant="body1" color="textSecondary">
                        Your cart is empty
                      </Typography>
                    </div>
                  )}
                </div>
              </Drawer>
            </div>
          </div>
        </nav>
      </motion.header>
    </>
  );
}
