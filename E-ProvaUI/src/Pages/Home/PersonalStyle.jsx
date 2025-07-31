import { Link } from 'react-router';
import { Button } from '../../Components/Button';

const PersonalStyle = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center bg-white p-4 sm:p-6 lg:p-8 rounded-lg my-8 gap-6 md:gap-8 lg:gap-12">
                <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        Personalized Style Recommendations Powered by AI
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                        Discover outfit ideas tailored uniquely to your style. Our AI learns from your wardrobe to suggest looks for any occasion.
                    </p>
                    <div className="pt-2">
                        <Link to="/e-prova/newarrivals">
                            <Button Name="Learn More" />
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src="https://res.cloudinary.com/dsobcez1a/image/upload/v1746243324/outfit2_vg5pcz.jpg"
                        alt="Outfit"
                        className="rounded-lg w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-auto object-cover shadow-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalStyle;