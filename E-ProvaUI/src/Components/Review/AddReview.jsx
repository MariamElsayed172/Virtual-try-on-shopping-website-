import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { ReviewContext } from "../../Func/context/ReviewContextProvider";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CircleLoader, ClockLoader } from "react-spinners";

export default function AddReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { id } = useParams();
  const { getReviews, addReview, deleteReview, UpdateReview } = useContext(ReviewContext);


  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getReviews(id);
      if (response?.success && Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
    console.log("🚀 ~ fetchReviews ~ error:", error)

      setError("Failed to load reviews. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (selectedRating, e) => {
    e.preventDefault();
    setRating(Number(selectedRating));
    setError("");
  };

  const handleEdit = (reviewToEdit) => {
    setEditingReview(reviewToEdit);
    setRating(reviewToEdit.rating);
    setReview(reviewToEdit.comment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      setError("Please write a review comment");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      if (editingReview) {
        await UpdateReview(editingReview._id, review.trim(), rating, id);
        setEditingReview(null);
      } else {
        await addReview(id, review.trim(), rating);
      }


      setRating(0);
      setReview("");


      await fetchReviews();
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      setError("Error submitting review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setIsDeleteLoading(true);
    await deleteReview(reviewId, id);
    await fetchReviews();
    setIsDeleteLoading(false);
  };

  return (
    <Box sx={{
      maxWidth: 800,
      margin: "2rem auto",
      padding: 4,
      background: "white",
      borderRadius: 3,
      boxShadow: 3,
    }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#333' }}>Reviews</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>{editingReview ? "Edit your review:" : "Click to review:"}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '2rem',
                color: star <= (hoveredStar || rating) ? '#FFD700' : '#ddd',
                padding: 0,
                transition: 'transform 0.2s',
                opacity: isLoading ? 0.7 : 1,
              }}
              onClick={(e) => handleStarClick(star, e)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
            >
              ★
            </motion.button>
          ))}
        </Box>
        <TextField
          multiline
          minRows={4}
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
            setError("");
          }}
          placeholder="Share your thoughts about this product..."
          disabled={isLoading}
          sx={{ width: '100%' }}
        />
        {error && <Typography color="error" sx={{ fontSize: '0.9rem' }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 2 }}>


          {editingReview && (
            <Button
              type="button"
              onClick={() => {
                setEditingReview(null);
                setRating(0);
                setReview("");
              }}
              variant="contained"
              sx={{ background: '#6c757d', '&:hover': { background: '#5a6268' } }}

            >
              Cancel Edit
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !rating || !review.trim()}
            sx={{ minWidth: 140 }}

          >
            {isLoading
              ? "Submitting..."
              : editingReview
              ? "Update Review"
              : "Submit Review"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>

        )}

        <AnimatePresence>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{
                  background: '#f8f9fa',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Box>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</Box>
                      <Typography>{review.comment}</Typography>
                      <Typography variant="caption">
                        Posted on {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        onClick={() => handleEdit(review)}
                        disabled={isLoading}
                        sx={{ color: '#1976d2', minWidth: 0 }}
                      >
                        {isLoading ? <ClockLoader color="#007bff" size={20} /> : <FaEdit />}
                      </Button>
                      <Button
                        onClick={() => handleDelete(review._id)}
                        disabled={isDeleteLoading}
                        sx={{ color: '#e74c3c', minWidth: 0 }}
                      >
                        {isDeleteLoading ? <CircleLoader color="#e74c3c" size={20} /> : <FaTrash />}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </motion.div>





            ))
          ) : (
            <Typography sx={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
              No reviews yet, lead the way and share your thoughts
            </Typography>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}