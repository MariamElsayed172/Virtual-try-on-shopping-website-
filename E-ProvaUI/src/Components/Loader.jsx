"use client"

import { motion } from "framer-motion"

export default function Loader() {
  const dotVariants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="flex gap-5"
        initial="pulse"
        animate="pulse"
        variants={{
          pulse: {
            transition: {
              staggerChildren: 0.2,
              repeat: Infinity,
            },
          },
        }}
      >
        <motion.div className="dot" variants={dotVariants} />
        <motion.div className="dot" variants={dotVariants} />
        <motion.div className="dot" variants={dotVariants} />
      </motion.div>

      {/* Inline styles for the dots */}
      <style jsx>{`
        .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #ff1f1f;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
