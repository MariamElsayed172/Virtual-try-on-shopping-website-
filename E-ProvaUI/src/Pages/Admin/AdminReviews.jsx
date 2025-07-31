import { useContext, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ReviewContext } from "../../Func/context/ReviewContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import NoData from "../../Components/NoData";
import Loader from "../../Components/Loader";
import CantFetch from "../../Components/CantFetch";
import { FaTrash } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const { getAllReviews, deleteReview } = useContext(ReviewContext);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
  });

  const reviews = response?.data || [];

  const handleDelete = async (reviewId, productId) => {
    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId, productId);
      await queryClient.invalidateQueries(["getAllReviews"]);
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (reviews.length === 0) {
    return <NoData />;
  }
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <CantFetch />;
  }
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gray-100 min-h-screen flex justify-center"
      >
        <div className="max-w-4xl w-full">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-semibold mb-4"
          >
            Admin Review Management
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Comment</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={container}
                initial="hidden"
                animate="show"
              >
                {reviews.map((review) => (
                  <motion.tr 
                    key={review._id} 
                    className="border-t"
                    variants={item}
                    whileHover={{ 
                      backgroundColor: "#f8f9fa",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <td className="p-3">
                      <img
                        src={review.productId?.defaultImage?.url}
                        alt={review.productId?.name || "Product Image"}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{review.userId.username}</td>
                    <td className="p-3">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <motion.button 
                            key={i} 
                            className="focus:outline-none"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {i < review.rating ? <AiFillStar /> : <AiOutlineStar />}
                          </motion.button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">{review.comment}</td>
                    <td className="p-3">{formatDate(review.createdAt)}</td>
                    <td className="p-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(review._id, review.productId)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        disabled={deletingId === review._id}
                      >
                        {deletingId === review._id ? (
                          <ImSpinner8 className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

