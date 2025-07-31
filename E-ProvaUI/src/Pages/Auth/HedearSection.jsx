import { Link } from "react-router";

export default function HedearSection() {
  return (
    <div>
      <section className="relative mb-10 lg:mb-36">
        <div className="relative block">
          {/*font-family should be "DM Sans", sans-serif*/}
          <h1 className=" text-center font-sans font-semibold text-2xl  text-[#181818] mb-1 relative leading-normal block md:text-xl">
            ACCOUNT
          </h1>
          <ol className="justify-center bg-white m-0 p-0 relative z-0 flex flex-wrap list-none rounded">
            <li className="mr-3.5 pr-2.5 relative  before:w-1 before:h-1 before:rotate-45 before:absolute before:-right-1 before:top-1/2 before:rounded-sm before:bg-[#222]">
              <Link
                to="/e-prova/home"
                className=" text-xs font-light duration-0 touch-manipulation text-[#222]"
              >
                Home
              </Link>
            </li>
            <li className="inline-block">
              <span className=" text-xs font-light text-[#222]">Account</span>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
