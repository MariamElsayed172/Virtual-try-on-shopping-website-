import { Outlet } from "react-router";
import { motion, useSpring, useScroll } from "framer-motion"
import Nav from "./Nav";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import BottomMenu from "./BottomMenu";

export default function Layout() {
  const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })
  return (
    <>
      <Nav />
      <div className="mx-3 mt-32">

      <motion.div
                id="scroll-indicator"
                style={{
                    scaleX: scaleX,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                }}
                className="fixed top-0 left-0 right-0 h-[10px] origin-left bg-[#ff1f1f] z-50"
            />

        <Outlet />
        <BackToTopButton />
        
      </div>
      <BottomMenu />
      <Footer />
    </>
  );
}

