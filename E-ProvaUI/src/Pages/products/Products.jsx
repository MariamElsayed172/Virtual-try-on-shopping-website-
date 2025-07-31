import { useState, useCallback, useContext, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductHeader from "./ProductHeader";
import SidebarProduct from "./SidebarProduct";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { PiImages } from "react-icons/pi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { WishListContext } from "../../Func/context/WishListContextProvider";
import { CartContext } from "../../Func/context/CartContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../Components/Button";
import PropTypes from "prop-types";
import { HiMenuAlt2 } from "react-icons/hi";
import axios from "axios";
import { AuthContext } from "../../Func/context/AuthContextProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import noProduct from "../../../public/Notfound/undraw_my-files_1xwx.svg";
import CantFetch from "../../Components/CantFetch";
import { motion } from "framer-motion";
// Star Rating Component from NewArrivals
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

export default function Products() {
  const { AddToWishList } = useContext(WishListContext);
  const { AddCart } = useContext(CartContext);
  const { cookies } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State management
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [loadingCart, setLoadingCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productToAddToCart, setProductToAddToCart] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    selectedBrands: [],
    selectedCategories: [],
    sort: "",
    keyword: "",
  });

  // Update filters when URL search parameters change
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const sort = searchParams.get("sort");

    setActiveFilters((prev) => ({
      ...prev,
      selectedCategories: category ? [category] : [],
      selectedBrands: brand ? [brand] : [],
      sort: sort || "",
      keyword: keyword || "",
    }));
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch products with filters and search
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", currentPage, activeFilters, location.search],
    queryFn: async () => {
      try {
        let allProducts = [];
        let response;

        // If we have both category and brand filters
        if (
          activeFilters.selectedCategories.length > 0 &&
          activeFilters.selectedBrands.length > 0
        ) {
          // Get products for each category and brand combination
          const filterPromises = activeFilters.selectedCategories.flatMap(
            (categoryId) =>
              activeFilters.selectedBrands.map((brandId) =>
                axios.get(
                  `https://e-prova.vercel.app/Product?category=${categoryId}&brand=${brandId}${
                    activeFilters.keyword
                      ? `&keyword=${activeFilters.keyword}`
                      : ""
                  }${activeFilters.sort ? `&sort=${activeFilters.sort}` : ""}`
                )
              )
          );
          const results = await Promise.all(filterPromises);
          allProducts = results.flatMap((result) => result.data.products);
        }
        // If we have only category filters
        else if (activeFilters.selectedCategories.length > 0) {
          // Make separate API call for each category
          const categoryPromises = activeFilters.selectedCategories.map(
            (categoryId) =>
              axios.get(
                `https://e-prova.vercel.app/Product?category=${categoryId}${
                  activeFilters.keyword
                    ? `&keyword=${activeFilters.keyword}`
                    : ""
                }${activeFilters.sort ? `&sort=${activeFilters.sort}` : ""}`
              )
          );
          const categoryResults = await Promise.all(categoryPromises);
          allProducts = categoryResults.flatMap(
            (result) => result.data.products
          );
        }
        // If we have only brand filters
        else if (activeFilters.selectedBrands.length > 0) {
          // Make separate API call for each brand
          const brandPromises = activeFilters.selectedBrands.map((brandId) =>
            axios.get(
              `https://e-prova.vercel.app/Product?brand=${brandId}${
                activeFilters.keyword ? `&keyword=${activeFilters.keyword}` : ""
              }${activeFilters.sort ? `&sort=${activeFilters.sort}` : ""}`
            )
          );
          const brandResults = await Promise.all(brandPromises);
          allProducts = brandResults.flatMap((result) => result.data.products);
        }
        // If we have no category or brand filters
        else {
          let url = `https://e-prova.vercel.app/Product?page=${currentPage}`;
          if (activeFilters.keyword) {
            url += `&keyword=${activeFilters.keyword}`;
          }
          if (activeFilters.sort) {
            url += `&sort=${activeFilters.sort}`;
          }
          response = await axios.get(url);
          allProducts = response.data.products;
        }

        // Apply price range filter
        if (
          activeFilters.priceRange.min > 0 ||
          activeFilters.priceRange.max < 10000
        ) {
          allProducts = allProducts.filter(
            (product) =>
              product.finalPrice >= activeFilters.priceRange.min &&
              product.finalPrice <= activeFilters.priceRange.max
          );
        }

        // Handle pagination for filtered results
        const totalProducts = allProducts.length;
        const productsPerPage = 12;
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        return {
          data: {
            products: paginatedProducts,
            totalPages: Math.ceil(totalProducts / productsPerPage),
          },
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        return {
          data: {
            products: [],
            totalPages: 0,
          },
        };
      }
    },
  });

  // Access products data correctly
  const products = productsData?.data?.products || [];
  const totalPages = productsData?.data?.totalPages || 1;

  // Handle filter changes from SidebarProduct
  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1);
    setActiveFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    const allImages = [
      selectedProduct.defaultImage,
      ...(selectedProduct.images || []),
    ];
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedProduct) return;
    const allImages = [
      selectedProduct.defaultImage,
      ...(selectedProduct.images || []),
    ];
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
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full mb-8"
      >
        <ProductHeader />
      </motion.div>
      <div className="container mx-auto px-4 py-8">
        {/* Show active search term if present */}
        {activeFilters.keyword && (
          <div className="mb-4">
            <p className="text-gray-600">
              Search results for:{" "}
              <span className="font-semibold">{activeFilters.keyword}</span>
            </p>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 rounded-md hover:bg-gray-100"
        >
          <HiMenuAlt2 size={24} />
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Mobile Overlay */}
          <div
            className={`fixed inset-0 z-50 lg:relative lg:z-0 ${
              isSidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Dark Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Content */}
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-4 overflow-y-auto lg:relative lg:w-64 transform transition-transform duration-300 ease-in-out">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
              <SidebarProduct
                filters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                Products ({products.length})
              </h2>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/e-prova/products/${product._id}`}
                  className="group block overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-[350px] rounded-lg overflow-hidden">
                    <img
                      src={product.defaultImage.url}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                    />
                    <img
                      src={product.images[0]?.url || product.defaultImage.url}
                      alt={`${product.name} Hover`}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Product Actions */}
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

                    {/* Add to Cart Button */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => openSizeModal(e, product)}
                        disabled={loadingCart[product._id]}
                        className="my-2 text-xs bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-md text-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loadingCart[product._id] ? (
                          <AiOutlineLoading3Quarters
                            className="animate-spin"
                            size={20}
                          />
                        ) : (
                          <Button Name={"ADD TO CART"} />
                        )}
                      </button>
                    </div>

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
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
                        ${product.finalPrice.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show "No products found" message when no results */}
            {products.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No products found.</p>
                <img
                  src={noProduct}
                  alt="No products found"
                  className="mx-auto h-40 w-40"
                />
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      // Show first page, last page, current page, and pages around current page
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - currentPage) <= 1
                      );
                    })
                    .map((pageNum, index, array) => {
                      // If there's a gap, show ellipsis
                      if (index > 0 && pageNum - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${pageNum}`} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-red-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Modal */}
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
                      : "bg-gray-200"
                  } ${selectedColor ? "border-black" : "border-transparent"}`}
                />
                <span className="text-sm capitalize">
                  {productToAddToCart.attributes?.color || "Default"}
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
                <AiOutlineLoading3Quarters
                  className="animate-spin mx-auto"
                  size={20}
                />
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
              <img
                src={
                  [selectedProduct.defaultImage, ...selectedProduct.images][
                    currentImageIndex
                  ].url
                }
                alt={`Product ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

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
              {[selectedProduct.defaultImage, ...selectedProduct.images].map(
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
