import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import classNames from 'classnames'

type Props = {
  products?: any
  modalImage: any
  currentProduct?: string
}

export const ProductLeft = ({
  products,
  modalImage,
  currentProduct,
}: Props) => {
  const img = modalImage[0]
  return (
    <div className="flex justify-center xmd:items-end pb-0">
      <div className={classNames(
        'relative min-w-[400px] min-h-[545px] w-[65vw] max-w-[580px] aspect-[580/790] z-10',
        'xs:aspect-[580/790]',
        'sm:w-[29vw] sm:aspect-[580/790]',
        'md:ml-0 md:aspect-[580/790] md:pb-14',
        'lg:items-start',
        'xmd:w-[33vw] xmd:h-auto xmd:ml-24 xmd:mb-[8%]',
        'xxl:w-[570px] xxl:h-[850px] xxl:ml-32 xxl:mb-[6%]',
        '4-xl:w-[30vw] 4-xl:mt-[240px] 4-xl:ml-[300px] 4-xl:justify-center'
      )}>
        <Image
          objectFit="contain"
          priority={true}
          layout="fill"
          src={img?.node.urlOriginal!}
          alt={img?.node.altText || 'Product Image'}
        />
      </div>
    </div>
  )
}
