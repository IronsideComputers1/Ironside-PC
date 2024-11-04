import React from 'react'
import type { Product } from './types'
import Image from 'next/image';

const getImageUrl = (product: Product): string | undefined => {
  const defaultImage = product.images.edges.find(edge => edge.node.isDefault);
  return defaultImage ? defaultImage.node.urlOriginal : undefined;
}

export const BlockItem = ({ subItem }: { subItem: Product }) => {
  console.log({subItem});
  const imageUrl = getImageUrl(subItem);
  const { name } = subItem;
  return (
    <div className='border rounded-lg w-64 h-64 flex items-start justify-between p-5 flex-col'>
      <div className='flex items-center justify-center w-full'>
        {imageUrl && <Image width="150px" height="150px" src={imageUrl} alt={name} objectFit="contain" />}
      </div>
      <div className='w-full'>
        <div className='w-full'>
          {name}
        </div>
        <div className='h-8'>
          {/* Toolbelt */}
        </div>
      </div>
    </div>
  )
}
