import { useState } from 'react';
import { Fade } from "react-awesome-reveal";

export default function Brands() {
    const [activeIcon, setActiveIcon] = useState(0);

    const icons = [
        {
            id: 0,
            src: 'https://res.cloudinary.com/dsobcez1a/image/upload/v1746242747/brand-1_cvlscq.png', 
            alt: 'Olivia Lindsay',
            content: '"There are no ugly women, there are just the ones who don\'t know how to make them look good."'
        },
        {
            id: 1,
            src: 'https://res.cloudinary.com/dsobcez1a/image/upload/v1746242747/brand-2_mmf4ey.png', 
            alt: 'The Black World',
            content: '"Beauty is within every woman, fashion is simply the art that reveals it to the world with elegance and grace."'
        },
        {
            id: 2,
            src: 'https://res.cloudinary.com/dsobcez1a/image/upload/v1746242747/brand-3_y9vv2x.png',
            alt: 'Salvador',
            content: '"There are no bad outfits, only those who haven\'t yet found the courage and confidence to wear them beautifully."'
        }
    ];

    return (
        <div className="w-full py-8 md:py-12 lg:py-16">
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-8 md:mb-12">
                        <h4 className="text-[#222222] font-semibold text-xs sm:text-sm tracking-[3px] mb-5">
                            IN THE PRESS
                        </h4>
                        <Fade delay={200} duration={1000} fraction={0.5} direction="up" triggerOnce>
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-8">
                                    <div className="font-semibold text-xl sm:text-2xl md:text-3xl text-[#181818]">
                                        <Fade direction="up" key={activeIcon} triggerOnce>
                                            {icons.find((icon) => icon.id === activeIcon)?.content}
                                        </Fade>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                                    {icons.map((icon) => (
                                        <button
                                            key={icon.id}
                                            onClick={() => setActiveIcon(icon.id)}
                                            className="p-2 sm:p-3 md:p-4 rounded-lg transition-all duration-200 hover:bg-gray-100"
                                        >
                                            <img
                                                src={icon.src}
                                                alt={icon.alt}
                                                className="h-8 sm:h-10 md:h-12 w-auto transition-opacity duration-200"
                                                style={activeIcon === icon.id ? { opacity: "1" } : { opacity: "0.5" }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </div>
                </div>
            </div>
        </div>
    );
}