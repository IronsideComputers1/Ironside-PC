import React from 'react'
import type { Product } from './types'
import Image from 'next/image';
import usePrice from '@framework/use-price';
import { CustomFieldSelect } from './CustomFieldSelect';

const getImageUrl = (product: Product): string | undefined => {
  const defaultImage = product.images.edges.find(edge => edge.node.isDefault);
  return defaultImage ? defaultImage.node.urlOriginal : undefined;
}

export const BlockItem = ({ subItem }: { subItem: Product }) => {
  const { price } = usePrice({
    // @ts-ignore next-line
    amount: Number(subItem?.price || subItem.prices?.price?.value),
    // @ts-ignore next-line
    baseAmount: Number(subItem?.price || subItem.prices?.retailPrice?.value),
    currencyCode: subItem.prices?.price?.currencyCode! || 'USD',
  })
  console.log({subItem});
  
  const imageUrl = getImageUrl(subItem);
  const { name, variants, customFields } = subItem;
  return (
    <div className='border rounded-lg w-56 h-auto flex items-start justify-between p-5 flex-col relative'>
      <div className='flex items-center justify-center w-full'>
        {imageUrl && <Image width="150px" height="150px" src={imageUrl} alt={name} objectFit="contain" />}
      </div>
      <div className='w-full'>
        <div className='w-full py-2'>
          {name}
        </div>
        <div className='h-8 flex items-center justify-between mt-6'>
          <div className='mr-2'>
            <CustomFieldSelect options={customFields.edges} onChange={(s) => {
              console.log('Selected', s);
            }} />
          </div>
            <div className="font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-xs" style={{ backgroundColor: '#1c1c1c' }}>
            +{price}
            </div>
        </div>
      </div>
      <div className='absolute inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center'>
        <div
          className="bg-white bg-opacity-25 border-black w-32 h-20 rounded-lg flex items-center justify-center"
          style={{ "backdropFilter": "blur(30px)" }}
        >
          <h4
            className='text-black m-0 capitalize text-xs font-Arimo text-center dark:text-white'
          >
            Out of stock
          </h4>
        </div>
      </div>
    </div>
  )
}
