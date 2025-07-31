// 
import { FaLeaf, FaTruck, FaMoneyBill, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Zoom } from "react-awesome-reveal";

export default function PolicySection() {
  const policyFeatures = [
    {
      title: "Sustainable Materials",
      description:
        "Experience eco-friendly shopping with products made from sustainably sourced materials.",
      icon: FaLeaf,
    },
    {
      title: "30 Days Free Returns",
      description:
        "Shop with complete confidence, knowing you’re covered by our 30-day free return policy on all of our products.",
      icon: FaTruck,
    },
    {
      title: "Free Delivery",
      description:
        "Enjoy free delivery on all orders exceeding 200 USD, bringing more value to your shopping experience.",
      icon: FaMoneyBill,
    },
    {
      title: "COD Delivery",
      description:
        "Enjoy the convenience of Cash on Delivery (COD) for a secure and hassle-free shopping experience.",
      icon: FaLock,
    },
  ];

  return (
    <div className="my-5">
      <Zoom direction="left" cascade triggerOnce>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
          {policyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div className="animate-shake" whileHover={{ rotate: 10 }}>
                <feature.icon size={40} className="mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Zoom>
    </div>
  );
}
