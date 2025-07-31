import { CiSearch } from "react-icons/ci";
import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories and brands when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchBrands();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://e-prova.vercel.app/Category/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('https://e-prova.vercel.app/Brand/all-brand');
      console.log("🚀 ~ fetchBrands ~ response:", response)
      setBrands(response.data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Handle search submission
  const handleSearch = async (searchType, value) => {
    setLoading(true);
    try {
      let searchQuery = '';
      
      switch (searchType) {
        case 'keyword':
          searchQuery = `keyword=${value}`;
          break;
        case 'category':
          searchQuery = `category=${value}`;
          break;
        case 'brand':
          searchQuery = `brand=${value}`;
          break;
        case 'sort':
          searchQuery = `sort=${value}`;
          break;
        default:
          searchQuery = `keyword=${value}`;
      }

      // Navigate to products page with search query
      navigate(`/e-prova/products?${searchQuery}`);
      setIsOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const hotSearches = [
    { type: 'sort', value: 'price', label: 'Price: Low to High' },
    { type: 'sort', value: '-price', label: 'Price: High to Low' },
    { type: 'sort', value: '-createdAt', label: 'Newest First' },
    ...(categories?.slice(0, 3)?.map(cat => ({ 
      type: 'category', 
      value: cat._id, 
      label: cat.name 
    })) || []),
    ...(brands?.slice(0, 2)?.map(brand => ({ 
      type: 'brand', 
      value: brand._id, 
      label: brand.name 
    })) || [])
  ];

  return (
    <>
      <div 
        className="relative"
        ref={searchRef}
      >
        <div 
          className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2 cursor-pointer shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CiSearch className="m-1 cursor-pointer" size={20} />
        </div>

        {/* Modal Overlay */}
        <div 
          className={`fixed inset-0 z-[9999] transition-all duration-500 ${
            isOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Backdrop with blur */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsOpen(false)}
          />

          {/* Search Modal */}
          <div 
            className={`fixed top-0 left-0 right-0 bg-white shadow-lg transition-all duration-500 ease-out transform ${
              isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
          >
            <div className="container mx-auto px-4 py-6">
              {/* Search Input */}
              <div className="relative flex items-center max-w-4xl mx-auto">
                <CiSearch className="absolute left-4 text-gray-400" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      handleSearch('keyword', searchTerm.trim());
                    }
                  }}
                  placeholder="Enter Your Keywords"
                  className="w-full pl-12 pr-10 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:border-black transition-colors"
                  disabled={loading}
                />
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="absolute right-4 text-gray-400 hover:text-black transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Hot Searches */}
              <div 
                className={`mt-8 max-w-4xl mx-auto transition-all duration-700 delay-100 transform ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <h3 className="text-sm font-semibold mb-4">HOT SEARCHES :</h3>
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item.type, item.value)}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
