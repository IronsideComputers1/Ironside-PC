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
    <div className="flex justify-center xmd:items-start pb-0 ">
      <div className={classNames(
        'w-[65vw] h-[52vh] z-10',
        'xs:h-[44vh]',
        'sm:w-[29vw] sm:h-[52vh]',
        'md:ml-0 md:h-auto md:pb-14',
        'xmd:w-[29vw] xmd:mt-2 xmd:ml-24 xmd:h-[70vh]',
        'lg:items-start',
        'xxl:w-[28vw] xxl:mt-4 xxl:ml-32 xxl:pb-0',
        '4-xl:w-[30vw] 4-xl:mt-[240px] 4-xl:ml-[300px] 4-xl:justify-center'
      )}>
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
