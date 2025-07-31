// Abdalrady
import { useState } from "react";
import { motion } from "framer-motion";
import { GoArrowRight, GoArrowUpRight } from "react-icons/go";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";

export default function ImageTab() {
  const [activeTab, setActiveTab] = useState("men");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleMouseEnter = (item) => setHoveredItem(item);
  const handleMouseLeave = () => setHoveredItem(null);

  const handleCategoryClick = (categoryName) => {
    navigate(`/e-prova/products?category=${categoryName.toLowerCase()}`);
  };

  const renderTabContent = (tab) => {
    const items = tab === "men"
      ? [
          { name: "LEATHER", imgSrc: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
          { name: "DENIM", imgSrc: "https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
          { name: "SWIMWEAR", imgSrc: "https://images.pexels.com/photos/1125135/pexels-photo-1125135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
        ]
      : [
          { name: "DRESSES", imgSrc: "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
          { name: "ACCESSORIES", imgSrc: "https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
          { name: "SWIMWEAR", imgSrc: "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
        ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 lg:px-8">
        {items.map((item, index) => (
          <div 
            key={item.name} 
            className="relative group cursor-pointer h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden rounded-lg"
            onClick={() => handleCategoryClick(item.name)}
          >
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={item.imgSrc}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-40"/>
              <button
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(item.name);
                }}
              >
                {item.name}
                {hoveredItem === item.name ? (
                  <GoArrowRight className="inline-block ml-2" />
                ) : (
                  <GoArrowUpRight className="inline-block ml-2" />
                )}
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Fade triggerOnce>
        <div className="uppercase flex gap-10 justify-center">
          <button
            className={`border-black transition-all font-bold ${activeTab === "men" ? "border-t-2" : ""}`}
            onClick={() => handleTabClick("men")}
          >
            Shop Men
          </button>
          <button
            className={`border-black transition-all font-bold ${activeTab === "women" ? "border-t-2" : ""}`}
            onClick={() => handleTabClick("women")}
          >
            Shop Women
          </button>
        </div>
        <div className="mt-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: activeTab === "men" ? 0 : 0.5 }}
          >
            {renderTabContent(activeTab)}
          </motion.div>
        </div>
      </Fade>
    </div>
  );
}
