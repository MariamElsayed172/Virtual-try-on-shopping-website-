import { Fade } from "react-awesome-reveal";
import { useState, useEffect } from "react";
import saleTimerBackground from "../../../public/Images/SaleTimerBG.webp";
import { GoArrowRight, GoArrowUpRight } from "react-icons/go"; // Ensure icons are imported
import { Link } from "react-router";

const SaleTimer = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const targetDate = "2025-12-31T23:59:59";

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden -mx-3 mt-2">
      <div
        className="relative bg-black py-4 sm:py-6 lg:py-10 h-full bg-cover bg-no-repeat bg-center flex items-center"
        style={{ backgroundImage: `url(${saleTimerBackground})` }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 lg:gap-8">
          <Fade direction="left" triggerOnce>
            <div className="text-center sm:text-left">
              <div className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-4 sm:mb-0">
                DON'T MISS{" "}
                <span className="text-yellow-400 font-bold">70% OFF</span> ALL
                SALE! NO CODE NEEDED!
              </div>
            </div>
          </Fade>

          <div>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <Fade cascade direction="right" triggerOnce>
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div
                    key={unit}
                    className="bg-white text-black rounded-full p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center text-center shadow-md min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]"
                  >
                    <span className="text-base sm:text-lg lg:text-xl font-bold">{value}</span>
                    <span className="text-xs sm:text-sm lg:text-base font-medium">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </span>
                  </div>
                ))}
              </Fade>
              <Link to="/e-prova/products">
              <button
                className="text-white font-semibold text-xs sm:text-sm lg:text-base px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center border border-white whitespace-nowrap"
                onMouseEnter={() => handleMouseEnter("View All Details")}
                onMouseLeave={handleMouseLeave}
              >
                <span>View All Details</span>
                {hoveredButton === "View All Details" ? (
                  <GoArrowRight className="inline-block ml-1 sm:ml-2" />
                ) : (
                  <GoArrowUpRight className="inline-block ml-1 sm:ml-2" />
                )}
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleTimer;

