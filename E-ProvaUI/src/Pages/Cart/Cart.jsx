import { useContext, useState } from "react";
import { CartContext } from "../../Func/context/CartContextProvider";
import { useQuery } from "@tanstack/react-query";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function Cart() {
  const { GetCart, UpdateCart, RemoveFromCart, ClearCart } =
    useContext(CartContext);
  const [deletingId, setDeletingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [loadingQuantity, setLoadingQuantity] = useState({});

  const { data, refetch } = useQuery({
    queryKey: ["Cart"],
    queryFn: () => GetCart(),
  });

  const handleRemoveFromCart = async (productId) => {
    try {
      setDeletingId(productId);
      await RemoveFromCart(productId);
      refetch();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await ClearCart();
      refetch();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      setLoadingQuantity((prev) => ({ ...prev, [productId]: true }));
      await UpdateCart(productId, quantity);
      refetch();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoadingQuantity((prev) => ({ ...prev, [productId]: false }));
    }
  };

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
              <span className="block transition-colors hover:text-inherit dark:hover:text-red-500">
                SHOPPING CART
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl md:text-3xl text-center font-semibold mb-6 uppercase">
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data?.data?.cart?.products?.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            {/* Remove from cart button */}
            <button
              onClick={() => handleRemoveFromCart(item.productId._id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start sm:self-center"
              disabled={deletingId === item.productId._id}
            >
              {deletingId === item.productId._id ? (
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
              <Link to={`/e-prova/products/${item.productId._id}`}>
                <img
                  src={item.productId.defaultImage.url}
                  alt={item.productId.name}
                  className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-md"
                />
              </Link>
            </div>

            {/* Product details */}
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow text-center sm:text-left">
              <h2 className="text-lg font-medium text-gray-900 hover:text-red-500 transition-all duration-300">
                {item.productId.name}
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-gray-900">
                    ${item.productId.finalPrice.toFixed(2)}
                  </p>
                  {item.productId.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.productId.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item.quantity - 1
                      )
                    }
                    disabled={
                      item.quantity <= 1 || loadingQuantity[item.productId._id]
                    }
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-8 text-center">
                    {loadingQuantity[item.productId._id] ? (
                      <AiOutlineLoading3Quarters
                        className="animate-spin mx-auto"
                        size={16}
                      />
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item.quantity + 1
                      )
                    }
                    disabled={loadingQuantity[item.productId._id]}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Color:{" "}
                  <span className="font-medium capitalize">
                    {item.productId.attributes.color}
                  </span>
                </p>
              </div>
            </div>

            {/* Total price */}
            <div className="mt-4 sm:mt-0 sm:ml-auto text-center sm:text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">
                ${(item.productId.finalPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {/* Cart Summary */}
        {data?.data?.cart?.products?.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Cart Summary</h2>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                {isClearing ? (
                  <span className="flex items-center">
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Clearing...
                  </span>
                ) : (
                  "Clear Cart"
                )}
              </button>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                ${data?.data?.cart?.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">Free</span>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold">
                  ${data?.data?.cart?.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <Link to={`/e-prova/order/${data?.data?.cart?._id}`}>
              <button className="w-full mt-6 bg-black text-white py-3 rounded-full hover:bg-gray-900 transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}

        {/* Empty cart */}
        {(!data?.data?.cart?.products ||
          data.data.cart.products.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
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
