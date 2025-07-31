// Abdalrady
import { Bounce } from "react-awesome-reveal";
import { Button } from "../../Components/Button";
import { useNavigate } from "react-router-dom";

const MenWomenSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/e-prova/products?category=${category.toLowerCase()}`);
  };

  return (
    <div className="my-6 bg-slate-100">
      <section className="text-center uppercase mt-4 mb-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-black to-red-500 text-transparent bg-clip-text">E-prova</h3>
      </section>
      <div className="flex flex-col md:flex-row items-center justify-center relative md:-ml-4">
        {/* Women Section */}
        <Bounce duration={1000} triggerOnce>
          <div className="flex justify-center w-full md:w-auto mb-4 md:mb-0">
            <img
              src="https://res.cloudinary.com/dsobcez1a/image/upload/v1746245481/stylish-young-woman-with-christmas-wreath-outside-waiting-christmas_is4vmw.jpg"
              alt="Women Shop"
              className="w-full md:w-auto max-w-[500px] max-h-[600px] object-cover md:object-center rounded-lg cursor-pointer"
              onClick={() => handleCategoryClick("women")}
            />
          </div>
        </Bounce>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center absolute bg-white bg-opacity-75 p-4 rounded-lg md:bg-transparent md:p-0 z-10 w-full md:w-auto">
          <Bounce delay={1000} duration={1500} triggerOnce>
            <p className="uppercase text-xs md:text-sm font-semibold text-slate-300">
              Shop Outfits
            </p>
            <h1 className="uppercase text-lg md:text-xl font-bold from-black to-red-500 mt-2">
              Hello Sweet Customer
            </h1>
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-2 md:gap-7">
              <Button Name="WOMEN" onClick={() => handleCategoryClick("women")} />
              <Button Name="MEN" onClick={() => handleCategoryClick("men")} />
            </div>
          </Bounce>
        </div>

        {/* Men Section */}
        <Bounce duration={500} triggerOnce>
          <div className="flex justify-center w-full md:w-auto mb-4 md:mb-0">
            <div className="bg-white">
              <img
                src="https://res.cloudinary.com/dsobcez1a/image/upload/v1746245215/van-gogh-portrait_yjowvy.jpg"
                alt="Men Shop"
                className="w-full md:w-auto max-w-[500px] max-h-[600px] object-cover md:object-center rounded-lg cursor-pointer"
                onClick={() => handleCategoryClick("men")}
              />
            </div>
          </div>
        </Bounce>
      </div>
    </div>
  );
};

export default MenWomenSection;