import { useContext, useState } from "react";
import { BrandContext } from "../../Func/context/Admin/BrandContextProvider";
import { CategoryContext } from "../../Func/context/Admin/CategoryContextProvider";
import { useQuery } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";

export default function SidebarProduct({ filters, onFilterChange }) {
  const { GetBrand } = useContext(BrandContext);
  const { GetCategory } = useContext(CategoryContext);
  
  // Local state for tracking filter changes before applying
  const [localFilters, setLocalFilters] = useState({
    priceRange: {
      min: filters.priceRange.min || 0,
      max: filters.priceRange.max || 10000
    },
    selectedBrands: filters.selectedBrands || [],
    selectedCategories: filters.selectedCategories || []
  });

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => GetBrand(),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => GetCategory(),
  });

  // Reset price range
  const handleResetPrice = (e) => {
    e.stopPropagation();
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { min: 0, max: 10000 }
    }));
  };

  // Reset brands
  const handleResetBrands = (e) => {
    e.stopPropagation();
    setLocalFilters(prev => ({
      ...prev,
      selectedBrands: []
    }));
  };

  // Reset categories
  const handleResetCategories = (e) => {
    e.stopPropagation();
    setLocalFilters(prev => ({
      ...prev,
      selectedCategories: []
    }));
  };

  // Reset all filters
  const handleResetAll = (e) => {
    e.stopPropagation();
    const resetFilters = {
      priceRange: { min: 0, max: 10000 },
      selectedBrands: [],
      selectedCategories: []
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters); // Apply reset immediately
  };

  // Handle price input changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: value
      }
    }));
  };

  // Handle brand selection
  const handleBrandChange = (brandId) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brandId)
        ? prev.selectedBrands.filter(id => id !== brandId)
        : [...prev.selectedBrands, brandId]
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  // Apply all filters
  const handleApplyFilters = () => {
    onFilterChange({
      ...localFilters,
      priceRange: {
        min: Number(localFilters.priceRange.min),
        max: Number(localFilters.priceRange.max)
      }
    });
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
      {/* Filter By Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-xl font-bold">FILTER BY</h2>
          <button 
            onClick={handleResetAll}
            className="flex items-center gap-2 bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            <IoClose /> CLEAR ALL
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm lg:text-base">PRICE</h3>
            <button 
              onClick={handleResetPrice}
              className="text-gray-400 text-xs lg:text-sm hover:text-gray-600"
            >
              RESET
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              name="min"
              value={localFilters.priceRange.min}
              onChange={handlePriceChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="max"
              value={localFilters.priceRange.max}
              onChange={handlePriceChange}
              max="10000"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="10000"
            />
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm lg:text-base">BRAND</h3>
            <button 
              onClick={handleResetBrands}
              className="text-gray-400 text-xs lg:text-sm hover:text-gray-600"
            >
              RESET
            </button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {brandsLoading ? (
              <div className="text-center py-2 text-gray-500 text-sm">Loading brands...</div>
            ) : (
              brands?.data?.data?.map((brand) => (
                <label key={brand._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input 
                    type="checkbox"
                    checked={localFilters.selectedBrands.includes(brand._id)}
                    onChange={() => handleBrandChange(brand._id)}
                    className="form-checkbox text-black rounded border-gray-300 focus:ring-black h-4 w-4"
                  />
                  <span className="text-sm">{brand.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm lg:text-base">CATEGORY</h3>
            <button 
              onClick={handleResetCategories}
              className="text-gray-400 text-xs lg:text-sm hover:text-gray-600"
            >
              RESET
            </button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {categoriesLoading ? (
              <div className="text-center py-2 text-gray-500 text-sm">Loading categories...</div>
            ) : (
              categories?.data?.categories?.map((category) => (
                <label key={category._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input 
                    type="checkbox"
                    checked={localFilters.selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    className="form-checkbox text-black rounded border-gray-300 focus:ring-black h-4 w-4"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={handleApplyFilters}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors mt-4 text-sm lg:text-base"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

SidebarProduct.propTypes = {
  filters: PropTypes.shape({
    priceRange: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number
    }),
    selectedBrands: PropTypes.arrayOf(PropTypes.string),
    selectedCategories: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

