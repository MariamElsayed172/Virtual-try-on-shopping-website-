import { useEffect, useState } from 'react'

export default function BackToTopButton() {
    const [backToTopButton, setBackToTopButton] = useState(false)


    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                setBackToTopButton(true)
            } else {
                setBackToTopButton(false)
            }
        })
    }, [])


    {/*nav + 0 */ }
    {/*auto */ }
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    return (
        <>

            {backToTopButton && (
                <div className='hidden fixed lg:inline bottom-[55px] right-[15px] z-[999] cursor-pointer'>
                    <span onClick={scrollUp}
                        className='w-[40px] h-[40px] flex items-center justify-center rounded-full border-[2px] border-black bg-black text-white shadow-[inset_0_0_0_3px_#fff] hover:transition hover:duration-200 hover:ease-linear hover:shadow-[inset_0_0_0_0_#fff]  text-xs animate-fade-in'>
                        <i className="fa-solid fa-chevron-up text-white"></i>
                    </span>
                </div >
            )
            }
        </>
    )
}