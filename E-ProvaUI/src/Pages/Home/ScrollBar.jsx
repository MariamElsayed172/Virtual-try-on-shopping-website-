// Abdalrady
import "./home.css";
import { WiAlien } from "react-icons/wi";
import { TbPointFilled } from "react-icons/tb";
import { Zoom } from "react-awesome-reveal";

const ScrollBar = () => {
  return (
    <div className="-mx-3">    
    <div className="overflow-hidden h-6 w-full bg-white my-4">
      <Zoom direction="up" cascade triggerOnce>
        <div className="whitespace-nowrap animate-marquee flex gap-10">
          {[...Array(7)].map((_, index) => (
            <div key={index}>
              <WiAlien size={25} className="inline-block" />
              <p className="inline-block font-semibold uppercase text-xs">
                Free shipping on all US order or order above $200
              </p>
              <TbPointFilled size={25} className="inline-block" />
            </div>
          ))}
        </div>
      </Zoom>
    </div>
    </div>
  );
};

export default ScrollBar;

