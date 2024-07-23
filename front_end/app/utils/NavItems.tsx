import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
    isMobile: boolean,
    activaItem: number
}

export const NavItemsData = [
    {
        name: "Home",
        url: "/"
    },
    {
        name: "Courses",
        url: "/courses"
    },
    {
        name: "About",
        url: "/about"
    },
    {
        name: "Policy",
        url: "/policy"
    },
    {
        name: "FAQ",
        url: "/faq"
    }
]
const NavItems: FC<Props> = (props: Props) => {
    return (
        <>
            <div className="hidden 800px:flex">
                {NavItemsData && NavItemsData.map((i, index) => (
                    <Link key={index} href={`${i.url}`} passHref>
                        <span className={`${props.activaItem === index ? "dark:text-[#37a39a] text-[crimson] " : "dark:text-white text-black"} text-[18px] px-6 font-Poppins font-[400] `}>
                            {i.name}  </span>
                    </Link>
                ))
                }
            </div>
            {
                props.isMobile && (
                    <div className=" 800px:hidden">
                        <div className='w-full text-center py-6 '>
                            <Link href={'/'} passHref>
                                <span className={'text-[25px] font-Poppins font-500 text-black dark:text-white'}>
                                    ELearning</span>
                            </Link>
                        </div>
                        {NavItemsData && NavItemsData.map((i, index) => (
                            <Link key={index} href={`${i.url}`} passHref>
                                <span className={`${props.activaItem === index ? "dark:text-[#37a39a] text-[crimson] " : "dark:text-white text-black"} block py-5 text-[18px] px-6 font-Poppins font-[400] `}>
                                    {i.name} </span>
                            </Link>
                        ))
                        }
                    </div>
                )
            }
        </>
    )
}

export default NavItems
