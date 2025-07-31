import { useContext, useState } from "react";
import { WishListContext } from "../../Func/context/WishListContextProvider";
import { useQuery } from "@tanstack/react-query";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function WishList() {
  const { GetWishList, RemoveFromWishList, ClearWishList } =
    useContext(WishListContext);
  const [deletingId, setDeletingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["WishList"],
    queryFn: () => GetWishList(),
  });

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setDeletingId(productId);
      await RemoveFromWishList(productId);
      refetch();
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearWishlist = async () => {
    try {
      setIsClearing(true);
      await ClearWishList();
      refetch();
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    } finally {
      setIsClearing(false);
    }
  };

  // Filter out any products that might have been deleted
  const validProducts = data?.data?.wishList?.products?.filter(
    (item) => item.product && item.product._id
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="header">
        <nav aria-label="Breadcrumb" className="flex justify-center">
          <ol className="flex items-center gap-1 text-sm text-red-500 dark:text-black">
            <li className="hover:text-dark-red">
              <Link
                to="/e-prova/home"
                className="block transition-colors hover:text-inherit dark:hover:text-red-500"
                aria-label="Home"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>
            </li>

            <li className="rtl:rotate-180 hover:text-dark-red">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>

            <li className="hover:text-dark-red">
              <span
                href="#"
                className="block transition-colors hover:text-inherit dark:hover:text-red-500"
              >
                WISH LIST
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl md:text-3xl text-center font-semibold mb-6 uppercase">
          My Wishlist
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {validProducts.map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            {/* Remove from wishlist button */}
            <button
              onClick={() => handleRemoveFromWishlist(item.product._id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start sm:self-center"
              disabled={deletingId === item.product._id}
            >
              {deletingId === item.product._id ? (
                <AiOutlineLoading3Quarters
                  size={20}
                  className="text-red-500 animate-spin"
                />
              ) : (
                <IoTrashOutline
                  size={20}
                  className="text-red-500 flex items-center justify-center"
                />
              )}
            </button>

            {/* Product img */}
            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
              <Link to={`/e-prova/products/${item.product._id}`}>
                <img
                  src={item.product.defaultImage?.url || '/placeholder-image.jpg'}
                  alt={item.product.name}
                  className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-md"
                />
              </Link>
            </div>

            {/* Product details */}
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow text-center sm:text-left">
              <h2 className="text-lg font-medium text-gray-900 hover:text-red-500 transition-all duration-300">
                {item.product.name}
              </h2>
              <div className="flex items-center justify-center sm:justify-start">
                <p className="text-xl font-semibold text-gray-900 mt-2">
                  ${item.product.finalPrice?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.product.discount > 0 && (
                    <span className="text-gray-500 line-through ml-2">
                      ${item.product.price?.toFixed(2) || '0.00'}
                    </span>
                  )}
                </p>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quick view button */}
            <Link
              to={`/e-prova/products/${item.product._id}`}
              className="mt-4 sm:mt-0 sm:ml-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              QUICK VIEW
            </Link>
          </div>
        ))}

        {/* Clear wishlist button */}
        {validProducts.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
              onClick={handleClearWishlist}
              disabled={isClearing}
            >
              {isClearing ? (
                <span className="flex items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Clearing...
                </span>
              ) : (
                "Clear Wishlist"
              )}
            </button>
          </div>
        )}

        {/* Empty wishlist */}
        {validProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Link
              to="/e-prova/products"
              className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
