import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import SliderSettings from './SliderSettings'

type Props = {
  products?: any
  modalImage: any
}

export const ProductLeft = ({ products, modalImage }: Props) => {
  return (
    <div className="customizer-product-left">
      {products?.map((img: any, idx: number) => {
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
