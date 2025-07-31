import { useContext } from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { PiSquaresFourLight } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa6";
import { GoPerson } from "react-icons/go";
import { WishListContext } from "../../Func/context/WishListContextProvider";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";


export default function BottomMenu() {
  const { GetWishList } = useContext(WishListContext);
  const { data } = useQuery({
    queryKey: ["WishList"],
    queryFn: () => GetWishList(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
  const count = data?.data?.wishList?.products?.length || 0;
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
    }}
    className="z-50 block md:hidden fixed w-full bottom-0 left-0 bg-white shadow-[0_-2px_5px_-2px_#0000001a] px-[15px] text-center">
      <div className="flex flex-wrap mx-[-15]">
        <div className="border-r border-[#e2e2e2] h-[55px] items-center justify-center flex basis-0 flex-grow max-w-full w-full px-[15px]">
          <Link
            to="/e-prova/home"
            className="inline-block relative text-[#181818] duration-200 touch-manipulation"
          >
            <IoHomeOutline className="inline-block text-[20px] text-[#000] hover:text-[#e94328] mb-[3px] font-[400px] leading-[1]" />
            <span className="block font-semibold text-[10px] text-[#868686] capitalize mt-[2px] text-center">
              Home
            </span>
          </Link>
        </div>
        <div className="border-r border-[#e2e2e2] h-[55px] items-center justify-center flex basis-0 flex-grow max-w-full w-full px-[15px]">
          <Link
            to="/e-prova/products"
            className="inline-block relative text-[#181818] duration-200 touch-manipulation"
          >
            <PiSquaresFourLight className="inline-block text-[30px] text-[#000] hover:text-[#e94328] mb-[-1px] font-[400px] leading-[1]" />
            <span className="block font-semibold text-[10px] text-[#868686] capitalize mt-[1px] text-center">
              Shopping
            </span>
          </Link>
        </div>
        <div className="border-r border-[#e2e2e2] h-[55px] items-center justify-center flex basis-0 flex-grow max-w-full w-full px-[15px]">
          <Link
            to="/e-prova/WishList"
            className="inline-block relative text-[#181818] duration-200 touch-manipulation"
          >
            <FaRegHeart className="inline-block text-[20px] text-[#000] mb-[3px] font-[400px] leading-[1]" />
            <span className="block font-semibold text-[10px] text-[#868686] capitalize mt-[2px] text-center">
              Wishlist
            </span>
            <div className="top-[-4px] text-[#fff] bg-[#181818]  border border-[#181818] w-[16px] h-[16px] min-w-[16px] text-[10px] z-[9px] flex items-center justify-center font-semibold text-center  absolute rounded-[50%] right-0 left-5">
              {count}
            </div>
          </Link>
        </div>
        <div className="border-r-[#e2e2e2] h-[55px] items-center justify-center flex basis-0 flex-grow max-w-full w-full px-[15px]">
          <Link
            to="/e-prova/Account"
            className="inline-block relative text-[#181818] duration-200 touch-manipulation"
          >
            <GoPerson className="inline-block text-[30px] font-semibold text-[#000] hover:text-[#e94328] mb-[-1px] leading-[1]" />
            <span className="block font-semibold text-[10px] text-[#868686] capitalize mt-[1px] text-center">
              Account
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

