import img from "../../../../public/Logo_Enhanced_resolution_mega.png";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { MdInsertComment} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../../../Func/context/AuthContextProvider";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";

export default function AdminNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate("/e-prova/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav>
          <div className="p-4 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <IconButton
                className="block lg:hidden text-gray-600 p-2 rounded-md hover:bg-gray-200"
                onClick={() => setIsDrawerOpen(true)}
              >
                <HiBars3CenterLeft size={20} />
              </IconButton>
              <Link to="/e-prova/admin" className="block">
                <img src={img} alt="Logo" className="w-28 h-20" />
              </Link>
            </div>
            <ul className="hidden lg:flex items-center gap-6 text-sm">
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/products/manage"
                >
                  Manage Products
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/categories"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/categories/manage"
                >
                  Manage Categories
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/brands"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/brands/manage"
                >
                  Manage Brands
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  to="/e-prova/admin/orders"
                >
                  Orders
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              {/* home */}
              <Link
                to="/e-prova/home"
                className="text-black hover:bg-black hover:text-white p-2 rounded-full transition-all duration-700"
              >
                <FaHome size={20} />
              </Link>
              {/* review */}
              <Link
                to="/e-prova/admin/reviews"
                className="text-black hover:bg-black hover:text-white p-2 rounded-full transition-all duration-700"
              >
                <MdInsertComment size={20} />
              </Link>
              {/* logout */}
              <button
                onClick={handleLogout}
                className="text-black hover:bg-black hover:text-white p-2 rounded-full transition-all duration-700"
              >
                <IoMdLogOut size={20} />
              </button>
            </div>
          </div>
          {/* drawer */}
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <List>
              {/* dashboard */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin"
              >
                <ListItemText primary="Dashboard" />
              </ListItem>

              {/* products */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/products"
              >
                <ListItemText primary="Products" />
              </ListItem>

              {/* manage products */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/products/manage"
              >
                <ListItemText primary="Products Management" />
              </ListItem>

              {/* categories */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/categories"
              >
                <ListItemText primary="Categories" />
              </ListItem>

              {/* manage categories */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/categories/manage"
              >
                <ListItemText primary="Categories Management" />
              </ListItem>

              {/* brands */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/brands"
              >
                <ListItemText primary="Brands" />
              </ListItem>

              {/* manage brands */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/brands/manage"
              >
                <ListItemText primary="Brands Management" />
              </ListItem>

              {/* orders */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/orders"
              >
                <ListItemText primary="Orders" />
              </ListItem>

              {/* reviews */}
              <ListItem
                button
                onClick={() => setIsDrawerOpen(false)}
                component={Link}
                to="/e-prova/admin/reviews"
              >
                <ListItemText primary="Reviews" />
              </ListItem>
            </List>
          </Drawer>
        </nav>
      </motion.header>
    </>
  );
}
