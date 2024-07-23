import React, { FC } from 'react';
import Head from 'next/head';

interface HeadProps {
  title: string;
  description: string;
  keywords: string;
}

const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
  console.log(title)
  return (
    <div>
      <title>{title}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </div>
  );
};

export default Heading;