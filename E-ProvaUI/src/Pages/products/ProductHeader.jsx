import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function ProductHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667 0%, #000 100%)",
        padding: "clamp(30px, 5vw, 60px) 20px",
        color: "white",
        textAlign: "center",
        minHeight: "200px",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold bg-gradient-to-r from-black to-red-700 bg-clip-text text-transparent"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: "bold",
          margin: "0",
          letterSpacing: "2px",
          padding: "0 15px",
        }}
      >
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-white to-red-700 bg-clip-text text-transparent"
        >
          E-
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          PROVA
        </motion.span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          fontSize: "clamp(1rem, 3vw, 1.5rem)",
          margin: "clamp(10px, 2vw, 15px) 0 0",
          opacity: "0.9",
          fontStyle: "italic",
          padding: "0 15px",
          maxWidth: "800px",
        }}
      >
        The Fashion Style E-Commerce
      </motion.p>
      <motion.nav 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        aria-label="Breadcrumb" 
        className="mb-8"
      >
        <ol className="flex items-center gap-1 text-sm text-red-500">
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Link
              to="/e-prova/home"
              className="block transition-colors hover:text-red-700"
            >
              Home
            </Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <IoIosArrowForward className="size-4" />
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <Link
              to="/e-prova/products"
              className="block transition-colors hover:text-red-700"
            >
              <span className="text-white hover:text-red-700 transition-all duration-300">Products</span>
            </Link>
          </motion.li>
        </ol>
      </motion.nav>
    </motion.div>
  );
}
