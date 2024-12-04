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
  return (
    <div className="customizer-product-left">
      {products?.map((img: any, idx: number) => {
        // We have a video for "Eden's Veil Platinum"
        if(currentProduct === "Eden's Veil Platinum") return null;
        return (
          <div key={idx}>
            <div
              className="bg-img"
              style={{
                backgroundImage: `url('${img?.node.urlOriginal}')`,
              }}
            />
          </div>
        );
      })}

      <Slider
        {...SliderSettings}
        className="customizer-product-slider custom-slick-dots"
      >
        {modalImage?.map((img: any, index: number) => (
          <div key={index} className="img">
            <div>
              <Image
                priority={true}
                height={767}
                width={639}
                className="customizer-product-image"
                src={img?.node.urlOriginal!}
                alt={img?.node.altText || 'Product Image'}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
