import DropdownArrow from '@components/icons/DropdownArrow'
import EmptyProduct from '@components/icons/EmptyProduct'
import React, { useState } from 'react'
import { BlockItem } from './BlockItem'
import classNames from 'classnames'
import { Product } from './types'

type Props = {
  prod: any
  subs: any
  incompatibleCats: any
  onModalSelection: any
  loadImage: any;
  renderColorName: any;
}

export const Block = ({ 
  prod,
  subs,
  incompatibleCats,
  onModalSelection,
  loadImage,
  renderColorName,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const subItems = subs?.products || [];
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  // console.log({subItems});
  // console.log({subs});
  
  return (
    <div className='flex flex-col w-full select-none'>
      <div
        className='flex items-center justify-between w-full'
        onClick={toggleAccordion}
      >
        <div className='flex items-center justify-start w-full'>
          <div className="p-3 mr-12">
            {!!prod?.images?.edges
              .length ? (
              <img
                width={50}
                height={50}
                src={loadImage(prod)}
              />
            ) : (
              <EmptyProduct />
            )}
          </div>

          <div className="options-name">
            <h3 className='font-Arimo text-base leading-4 text-left capitalize mb-1.5'>
              {subs?.categoryName}
            </h3>
            <h4 className="mb-0 font-Inconsolata text-base leading-4 text-basicDark font-normal tracking-normal capitalize">
              {prod?.name.length > 35
                ? `${renderColorName(
                    prod
                  )?.substring(
                    0,
                    35
                  )}...`
                : renderColorName(prod)}
            </h4>
          </div>
        </div>
        <div className={classNames(
          'border w-auto h-9 px-3 rounded-full flex items-center justify-center',
          {
            'transform rotate-180': isOpen,
          }
        )}>
          <div className='text-gray-600'>
            <DropdownArrow width={10} height={6} />
          </div>
        </div>
      </div>
      {isOpen && <div className='flex gap-3 flex-wrap'>
        {subItems.map((subItem: Product) => (
          <BlockItem key={subItem.entityId} subItem={subItem} />
        ))}
      </div>}
    </div>
  )
}
