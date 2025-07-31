import { useState } from "react";
import { GoArrowRight, GoArrowUpRight } from "react-icons/go";

export const Button = ({ Name, onClick }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseEnter = () => setHoveredButton(Name);
  const handleMouseLeave = () => setHoveredButton(null);

  return (
    <button
      className="bg-white text-black px-4 py-2 md:px-6 md:py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {Name}
      {hoveredButton === Name ? (
        <GoArrowRight className="inline-block ml-2" />
      ) : (
        <GoArrowUpRight className="inline-block ml-2" />
      )}
    </button>
  );
};

