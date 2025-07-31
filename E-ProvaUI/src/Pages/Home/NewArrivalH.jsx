import { CiStar } from "react-icons/ci";
import { PiImages } from "react-icons/pi";
import { Button } from "../../Components/Button";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useContext, useState } from "react";
import { ProductContext } from "../../Func/context/Admin/ProductContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { WishListContext } from "../../Func/context/WishListContextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CartContext } from "../../Func/context/CartContextProvider";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";
import NoData from "../../Components/NoData";
import CantFetch from "../../Components/CantFetch";

const StarRating = ({ rating }) => {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-yellow-400" size={14} />);
    } else if (i - 0.5 <= rating) {
      stars.push(
        <FaStarHalfAlt key={i} className="text-yellow-400" size={14} />
      );
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" size={14} />);
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default function NewArrivalH() {
  const { GetProduct } = useContext(ProductContext);
  const { AddToWishList } = useContext(WishListContext);
  const { AddCart } = useContext(CartContext);
  const { cookies } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [loadingCart, setLoadingCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productToAddToCart, setProductToAddToCart] = useState(null);

  // get products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["GetProduct"],
    queryFn: () => GetProduct(),
  });

  async function handleAddToWishList(e, productId) {
    try {
      e.preventDefault();
      e.stopPropagation();

      setLoadingWishlist((prev) => ({ ...prev, [productId]: true }));

      await AddToWishList(productId);
    } finally {
      setLoadingWishlist((prev) => ({ ...prev, [productId]: false }));
    }
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const openSizeModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!cookies.accessToken) {
      toast.error("Please login to add items to cart");
      navigate("/e-prova/login");
      return;
    }
    
    // Check if product has sizes available
    if (!product.attributes?.sizes || product.attributes.sizes.length === 0) {
      console.log("No sizes available for this product");
      return;
    }
    
    setProductToAddToCart(product);
    setSelectedSize("");
    setSelectedColor(product.attributes?.color || "");
    setShowSizeModal(true);
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
    setProductToAddToCart(null);
    setSelectedSize("");
    setSelectedColor("");
  };

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize || !selectedColor || !productToAddToCart) return;

    try {
      setLoadingCart((prev) => ({ ...prev, [productToAddToCart._id]: true }));
      await AddCart(productToAddToCart._id, 1, selectedSize, selectedColor);
      await queryClient.invalidateQueries({ queryKey: ["Cart"] });
      closeSizeModal();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoadingCart((prev) => ({ ...prev, [productToAddToCart._id]: false }));
    }
  }

  const handleOpenCarousel = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const handleCloseCarousel = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (!selectedProduct) return;
    const allImages = [selectedProduct.defaultImage, ...selectedProduct.images];
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedProduct) return;
    const allImages = [selectedProduct.defaultImage, ...selectedProduct.images];
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <CantFetch />;
  }

  if (!data) {
    return <NoData />;
  }

  // Sort products by createdAt date (newest first) and limit to 5
  const sortedProducts = data?.data?.products
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 5);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* header */}
      <section className="text-center uppercase mt-10 mb-4">
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-black to-red-500 text-transparent bg-clip-text">
          New Arrivals
        </h3>
      </section>
      {!sortedProducts?.length ? (
        <div className="text-center text-2xl font-bold">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {sortedProducts.map((product) => (
            <Link
              key={product._id}
              to={`/e-prova/products/${product._id}`}
              className="group block overflow-hidden"
            >
              {/* image */}
              <div className="relative h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <img
                  src={product.defaultImage.url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                />

                <img
                  src={product.images[0].url}
                  alt={`${product.name} Hover`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                {/* icons */}
                <div className="absolute top-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddToWishList(e, product._id)}
                    disabled={loadingWishlist[product._id]}
                    className="my-2 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingWishlist[product._id] ? (
                      <AiOutlineLoading3Quarters
                        className="animate-spin"
                        size={20}
                      />
                    ) : (
                      <CiStar size={20} />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleOpenCarousel(e, product)}
                    className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-md"
                  >
                    <PiImages size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={(e) => openSizeModal(e, product)}
                    disabled={loadingCart[product._id]}
                    className="my-2 text-xs bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-md text-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingCart[product._id] ? (
                      <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                    ) : (
                      <Button Name={"ADD TO CART"} />
                    )}
                  </button>
                </div>
                <div className="absolute top-4 left-8 -translate-x-1/2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 rounded-full">
                    {product.discount}%
                  </span>
                </div>
              </div>
              {/* details */}
              <div className="relative bg-white pt-4">
                <span className="text-xs text-gray-500 hover:text-red-500">
                  {product.category.name}
                </span>
                <h3 className="text-sm sm:text-base text-gray-700 group-hover:underline group-hover:underline-offset-4 hover:text-red-500 truncate">
                  {product.name}
                </h3>

                <StarRating rating={parseFloat(product.averageRating)} />
                <div className="mt-2 flex items-center justify-between text-gray-900">
                  <p className="font-medium text-red-500 tracking-wide">
                    {product.finalPrice.toFixed(2)}$
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {product.price.toFixed(2)}$
                  </p>
                </div>
                <div className="mt-4 flex justify-center">
                  <Link
                    to={`/e-prova/outfit/${product._id}`}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Try-On
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center mt-8">
        <Link
          to="/e-prova/newarrivals"
          className="my-2 p-5 text-xl flex items-center justify-center transition-all duration-300 rounded-full text-nowrap hover:scale-105 hover:shadow-lg"
        >
          <Button Name={"SHOP ALL PRODUCT"} />
        </Link>
      </div>

      {/* Size and Color Selection Modal */}
      {showSizeModal && productToAddToCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeSizeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Options</h3>
              <button
                onClick={closeSizeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Color</h4>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    productToAddToCart.attributes?.color
                      ? `bg-${productToAddToCart.attributes.color}-500`
                      : 'bg-gray-200'
                  } ${
                    selectedColor ? 'border-black' : 'border-transparent'
                  }`}
                />
                <span className="text-sm capitalize">
                  {productToAddToCart.attributes?.color || 'Default'}
                </span>
              </div>
            </div>
            
            {/* Size Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {productToAddToCart.attributes?.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`p-2 border rounded-md ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {productToAddToCart.attributes?.sizes?.length === 0 && (
              <p className="text-red-500 text-center mb-4">No sizes available</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className={`w-full py-2 px-4 rounded-full text-white ${
                selectedSize && selectedColor
                  ? "bg-black hover:bg-gray-900"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loadingCart[productToAddToCart?._id] ? (
                <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={20} />
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image Carousel Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseCarousel}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseCarousel}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <IoClose size={24} />
            </button>

            <div className="relative aspect-[3/2]">
              {selectedProduct && (
                <img
                  src={
                    [selectedProduct.defaultImage, ...selectedProduct.images][
                      currentImageIndex
                    ].url
                  }
                  alt={`Product ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}

              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <IoIosArrowBack size={24} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <IoIosArrowForward size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} /{" "}
                {selectedProduct
                  ? [selectedProduct.defaultImage, ...selectedProduct.images]
                      .length
                  : 0}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 p-4 overflow-x-auto">
              {selectedProduct &&
                [selectedProduct.defaultImage, ...selectedProduct.images].map(
                  (image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}