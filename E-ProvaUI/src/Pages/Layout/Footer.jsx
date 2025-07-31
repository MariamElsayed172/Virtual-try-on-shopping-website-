import { Dropdown } from "flowbite-react";
import img from "../../../public/image.png";
import logo from "../../../public/Logo_Enhanced_resolution_mega.png";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        className="bg-white"
      >
        <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 border-t border-gray-200 pt-10">
            {/* first section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="border-r border-gray-200"
            >
              <div className="flex justify-center sm:justify-start">
                <img src={img} alt="logo" className="w-24 h-20" />
                <img src={logo} alt="logo" className="w-24 h-20" />
              </div>

              <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
                E-Prova is a platform for how you present yourself to the world,
                especially today, when human communication is so fast. Fashion
                is an instant language. Fashion is the armor to survive the
                reality of everyday life.
              </p>

              <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                <li>
                  <a
                    href="https://www.facebook.com/mrwan.abdalrady.5"
                    rel="noreferrer"
                    target="_blank"
                    className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/marwan-abdalrady-57b87b222/"
                    rel="noreferrer"
                    target="_blank"
                    className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2"
                  >
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/MarwanabdalR"
                    rel="noreferrer"
                    target="_blank"
                    className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2"
                  >
                    <i className="fa-brands fa-github"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://protofolio-git-main-marwans-projects-3f5c5d0c.vercel.app/"
                    rel="noreferrer"
                    target="_blank"
                    className="text-black transition hover:text-white/75 hover:bg-black hover:border-black border-2 rounded-full p-2"
                  >
                    <i className="fa-solid fa-briefcase"></i>
                  </a>
                </li>
              </ul>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
              {/* second */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center sm:text-left"
              >
                <p className="text-lg font-medium text-gray-900">
                  Company Info
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      About Us
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      Our Blog
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      Store Location
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      Testimonial
                    </a>
                  </li>
                </ul>
              </motion.div>
              {/* third */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center sm:text-left"
              >
                <p className="text-lg font-medium text-gray-900">
                  Help & Support
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      SHIPPING INFO
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      RETURNS
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      HOW TO ORDER
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      HOW TO TRACK
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      SIZE GUIDE
                    </a>
                  </li>
                </ul>
              </motion.div>
              {/* forth */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center sm:text-left"
              >
                <p className="text-lg font-medium text-gray-900">MY ACCOUNT</p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      LOGIN
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      REGSTERI
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      WHISH LIST
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      TRACK YOUR ORDER
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75"
                      href="#"
                    >
                      {" "}
                      CHECKOUT
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          {/* copy right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 border-t border-gray-100 pt-6"
          >
            <div className="text-center sm:flex sm:justify-between sm:text-left">
              <p className="text-sm text-gray-500">
                <i className="fa-solid fa-location-crosshairs"></i>
                <span className="block sm:inline">
                  Miami Store: 15 West 21th Street, Miami FL, USA.
                </span>
              </p>

              <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
                <i className="fa-solid fa-location-crosshairs"></i>
                <span className="block sm:inline">
                  Chicago Store: 5400 N. Lakewood Ave, Chicago, IL 60640
                </span>
              </p>
            </div>
            <div className="mt-8 sm:mt-7 md:mt-6 lg:mt-5 text-base text-black sm:order-first text-center">
              Copyright © 2025 Nova Creative. All Rights Reserved.
            </div>

            <div className="flex space-x-4 justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                className="w-10 h-10 rounded-full"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MasterCard_1979_logo.svg/1920px-MasterCard_1979_logo.svg.png"
                alt="Maestro"
                className="w-10 h-10 rounded-full"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="w-10 h-10 rounded-full"
              />
              <img
                src="https://www.cirrusconnects.com/wp-content/uploads/2021/09/Cirrus_logo_one.png"
                alt="Cirrus"
                className="w-10 h-10 rounded-full"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                alt="American Express"
                className="w-10 h-10 rounded-full"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
                alt="Bitcoin"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </motion.div>
          {/* language */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-5 mt-5"
          >
            <Dropdown label="Dropdown" size="sm">
              <Dropdown.Item>CAD | Candian</Dropdown.Item>
              <Dropdown.Item>EUR | Germany</Dropdown.Item>
              <Dropdown.Item>GBP | Great Britain</Dropdown.Item>
              <Dropdown.Item>USD | USA</Dropdown.Item>
            </Dropdown>
            <Dropdown label="Dropdown" size="sm">
              <Dropdown.Item>ENGLISH</Dropdown.Item>
              <Dropdown.Item>DEUTISH</Dropdown.Item>
              <Dropdown.Item>FRENCH</Dropdown.Item>
            </Dropdown>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
