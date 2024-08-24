'use client'
import React, { FC, useState } from 'react';
import { Header } from './components/Header'
import Heading from './utils/Heading'
import { Hero } from './components/Routes/Hero';
interface Props { };

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div>
      <Heading
        title='ELearning'
        description='A platform to learn and grow with fun'
        keywords='ReactJs,NextJs,MONGO_DB'
      />
      <Header
        open={open}
        setOpen={setOpen}
        activaItem={activeItem}
      />
      <Hero/>
    </div>
  );
}


export default Page