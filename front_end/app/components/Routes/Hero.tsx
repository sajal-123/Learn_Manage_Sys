import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';
import img from '../../../public/assets/Hero.png';

interface Props { }

const Hero: FC<Props> = (props) => {
  return (
    <div className='w-full flex items-center min-h-[90vh]'>
      <div className="left-0 md:flex max-md:flex-col w-full 1500px:h-[700px] items-center  1000px:h-[600px]  rounded-full">
        <div className="1000px:w-[40%] m-12 md:m-4  aspect-square  rounded-full flex justify-center hero_animation 1500px:w-[50%] 1000px:min-h-[40%] items-center z-10">
          <Image
            src={img}
            alt="Hero Image"
            className='object-contain rounded-full max-w-full 1100px:max-w-[70%] 1500px:max-w-[80%] w-[90%] h-auto z-[10]'
          />
        </div>
        <div className='flex  flex-col items-center 1000px:w-[60%] 1000px:mt-0 1100px:px-28 px-12 text-center lg:text-left'>
          <h2 className='dark:text-white text-[#000000c7] text-[40px] px-3 w-full 1500px:text-[60px] 1000px:text-[40px] font-semibold font-Josefin 1000px:leading-[75px] leading-[55px] '>
            Improve your online Learning Experience better instantly
          </h2>
          <br />
          <p className='dark:text-white text-[#000000ac] font-Josefin px-3 w-full text-[18px]  font-[600]  '>We have 40k+ online courses & 500k + Online registered student. Find your desired courses from them</p>
          <br />
          <form className="flex items-center w-full">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                </svg>
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white hero_animation rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
          <br />
          <br />
          <div className='flex items-center'>
            <Image
              src={img}
              alt="img"
              className=' rounded-full border h-12 w-12'
            />
            <Image
              src={img}
              alt="img"
              className='ml-[-20px] border rounded-full h-12 w-12'
            />
            <Image
              src={img}
              alt="img"
              className='ml-[-20px] border rounded-full h-12 w-12'
            />
            <p className='dark:text-white text-[#000000ac] font-Josefin px-1 w-full text-[18px]  font-[600] '>500K people already trusted us .{""}
              <Link href={'/courses'} className="dark:text-[#37a39a] text-[crimson]">
              View Courses
              </Link>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export { Hero };
