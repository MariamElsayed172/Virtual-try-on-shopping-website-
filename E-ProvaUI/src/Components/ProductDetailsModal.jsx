import { useState } from 'react';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";

export default function ProductDetailsModal({ isOpen, onClose, product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-1"
        >
          <IoClose size={20} />
        </button>

        {/* Main Image */}
        <div className="h-[400px] overflow-hidden">
          <img
            src={selectedImage === 0 ? product.defaultImage.url : product.images[selectedImage - 1].url}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-8 gap-1 p-2 bg-gray-50">
          <button
            onClick={() => setSelectedImage(0)}
            className={`aspect-square rounded-md overflow-hidden border ${
              selectedImage === 0 ? 'border-black' : 'border-transparent'
            }`}
          >
            <img
              src={product.defaultImage.url}
              alt={`${product.name} thumbnail`}
              className="w-full h-full object-cover"
            />
          </button>
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)}
              className={`aspect-square rounded-md overflow-hidden border ${
                selectedImage === index + 1 ? 'border-black' : 'border-transparent'
              }`}
            >
              <img
                src={image.url}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

ProductDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    defaultImage: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired
    })).isRequired
  })
};
