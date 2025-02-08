import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import SliderSettings from './SliderSettings'
import { Video } from '@components/ui/Video/Video'

type Props = {
  products?: any
  modalImage: any
  currentProduct?: string
}

export const ProductLeft = ({ products, modalImage, currentProduct }: Props) => {
  const img = modalImage[0];
  return (
    <div className='flex justify-center pb-8 lg:items-start xxl:pb-0 4-xl:justify-end'>
      {/* {products?.map((img: any, idx: number) => {
        // We have a video for "Eden's Veil Platinum"
        // TODO: Check from custom fields insted of product name
        if(currentProduct === "Eden's Veil Platinum") return null;
        return (
          <div key={idx} className='md:hidden'>
            <div
              className="bg-img"
              style={{
                backgroundImage: `url('${img?.node.urlOriginal}')`,
              }}
            />
          </div>
        );
      })} */}
      <div className='w-[65vw] h-[52vh] sm:w-[29vw] md:ml-20 xxl:w-[28vw] xxl:mt-4 xxl:ml-32 4-xl:w-[31.5vw]'>
        <Image
          objectFit="fill"
          priority={true}
          layout="responsive"
          height={790}
          width={580}
          src={img?.node.urlOriginal!}
          alt={img?.node.altText || 'Product Image'}
        />
      </div>
    </div>
  )
}
