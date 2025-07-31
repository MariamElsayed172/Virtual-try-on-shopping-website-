import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react"; 
import Loader from "../../Components/Loader";
import CantFetch from "../../Components/CantFetch";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";

export default function Outfit() {
  const { id: productId } = useParams();
  const [userImage, setUserImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: response,
    isLoading: productLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axios.get(
        `https://e-prova.vercel.app/Product/get-product/${productId}`
      );
      return response.data;
    },
  });

  const product = response;

  const handleUserImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const handleTryOn = async () => {
    if (!userImage || !product?.product?.AIimage?.url) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('human image', userImage);
      formData.append('garment_image', product.product.AIimage.url);
      formData.append('description', product.product.description);

      const response = await axios.post(
        'https://e-prova.vercel.app/AI/try-on',
        formData,
      );

      setResultImage(response.data.result.result_url);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process images');
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (productLoading) return <Loader />;
  if (isError || !product) return <CantFetch />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-blue-50 flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 sm:mb-4 text-gray-800 drop-shadow-sm">
        Change Clothes Online with <span className="text-red-500">AI</span>
      </h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-center max-w-xl">
        Experience AI virtual try-on clothes with E-Prova. Upload your photo and see how the outfit fits you instantly!
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 w-full max-w-5xl">
        {/* Upload Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xs flex flex-col items-center mb-6 lg:mb-0">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <CloudUpload className="w-10 h-10 text-teal-500 mb-2" />
            <p className="text-teal-500 font-semibold">Upload your outfit</p>
            <p className="text-gray-400 text-sm">Or just drop here</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleUserImageChange}
              className="hidden"
            />
          </label>
          {userImage && (
            <img
              src={URL.createObjectURL(userImage)}
              alt="User Preview"
              className="mt-4 w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          )}
        </div>

        {/* AI Image & Result Section */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center w-full justify-center">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 w-full max-w-xs">
            <p className="mb-2 text-gray-700 font-medium">AI Clothes</p>
            <img
              src={product?.product?.AIimage?.url}
              alt="AI Clothes"
              className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm bg-gray-50"
            />
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 w-full max-w-xs">
            <p className="mb-2 text-gray-700 font-medium">Result</p>
            <img
              src={resultImage || "../../../public/cat.png"}
              alt="Result"
              className={`w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm bg-gray-50 ${resultImage ? '' : 'hidden'}`}
            />
          </div>
        </div>
      </div>

      <button
        disabled={!userImage || isProcessing}
        onClick={handleTryOn}
        className={`mt-8 px-8 py-3 rounded-full shadow-md transition-all duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          ${userImage && !isProcessing ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
        `}
      >
        {isProcessing ? <PropagateLoader size={8} color="#000" /> : 'Try On'}
      </button>
    </div>
  );
}
