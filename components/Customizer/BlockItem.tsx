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
  // console.log({subItem});
  const { price } = usePrice({
    // @ts-ignore next-line
    amount: Number(subItem?.price || subItem.prices?.price?.value),
    // @ts-ignore next-line
    baseAmount: Number(subItem?.price || subItem.prices?.retailPrice?.value),
    currencyCode: subItem.prices?.price?.currencyCode! || 'USD',
  })
  const imageUrl = getImageUrl(subItem);
  const { name, productOptions, variants, customFields } = subItem;
  if(productOptions.edges.length > 0) {
    console.log({productOptions}); 
  }
  if(variants.edges.length > 0) {
    console.log({variants}); 
  }
  if(customFields.edges.length > 0) {
    console.log({customFields}); 
  }
  return (
    <div className='border rounded-lg w-56 h-auto flex items-start justify-between p-5 flex-col'>
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
    </div>
  )
}
