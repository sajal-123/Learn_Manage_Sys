'use client'
import React, { FC, useState } from 'react'
import Link from 'next/link';
import NavItems from '../utils/NavItems'
import { ThemeSwitcher } from '../utils/ThemeSwitcher'
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    activaItem: number
};

const Header: FC<Props> = (props: Props) => {
    const [active, setActive] = useState(false)
    const [openSideBar, setOpenSidebar] = useState(false)

    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false)
            }
        })
    }

    const HandleClose = (e: any) => {
        if (e.target.id === 'screen') {
            setOpenSidebar(false)
        }
    }
    return (
        <div className='w-full relative'>
            <div className={active ?
                `dark:bg-opacity-50 bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500`
                : `w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow`}>

                <div className=' w-[95%] 800px:w-[92%] m-auto py-2 h-full'>
                    <div className="w-full h-p[80px] flex items-center justify-between p-3">
                        <div>
                            <Link href={'/'}
                                className='text-[25px] font-Poppins font-[500] text-black dark:text-white'>
                                E-Learning
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <NavItems activaItem={props.activaItem} isMobile={false} setOpenSidebar={()=>(setOpenSidebar(false))}/>
                            <ThemeSwitcher />

                            {/* Only for mobile */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3 size={25} className='cursor-pointer dark:text-white text-black' onClick={() => setOpenSidebar(true)} />
                            </div>
                            <HiOutlineUserCircle size={25} className='800px:block hidden cursor-pointer dark:text-white text-black' onClick={() => props.setOpen(true)} />
                        </div>
                    </div>
                </div>
                {/* For mobile sidebar */}
                {
                    openSideBar && (
                        <div className='fiexd w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]' onClick={(e) => HandleClose(e)} id='screen'>
                            <div className='w-[70%] fixed h-screen z-[9999999] bg-white dark:bg-slate-900 dark:opacity-90 top-0 right-0'>
                                <NavItems activaItem={props.activaItem} isMobile={true} />
                                <HiOutlineUserCircle size={25} className='cursor-pointer ml-5 my-2 dark:text-white text-black' onClick={() => props.setOpen(true)} />
                                    <br />
                                    <br />
                                    <p>Copyright @ 2023 learning</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export { Header }
