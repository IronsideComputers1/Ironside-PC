import DropdownArrow from '@components/icons/DropdownArrow'
import EmptyProduct from '@components/icons/EmptyProduct'
import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

type Props = {
  prod: any
  subs: any
  incompatibleCats: any
  onModalSelection: any
  loadImage: any;
  renderColorName: any;
  children?: any
}

export const Block = ({ 
  prod,
  subs,
  incompatibleCats,
  onModalSelection,
  children,
  loadImage,
  renderColorName,
}: Props) => {
  const theme = useGetTheme();
  const blockRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (blockRef.current && !blockRef.current.contains(event.target as Node)) {
      console.log('Clicked outside the component');
      // setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    onModalSelection(subs);
  };

  const incompatibleItems = incompatibleCats?.some(
    (cat: any) =>
      cat ===
      subs.categoryName
  );

  const hasImages = prod?.images?.edges.length > 0;
  
  return (
    <div ref={blockRef} id={subs.categoryName.toLowerCase()} className='flex flex-col w-full select-none pr-7'>
      <div
        className={classNames('flex items-center justify-between w-full h-20', incompatibleItems && 'incompatible')}
        onClick={toggleAccordion}
      >
        <div className='flex items-center justify-start w-full'>
          <div className="p-3 mr-12">
            {hasImages ? (
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
          <div className={classNames(theme === "dark" ? 'text-gray-600' : 'text-gray-300')}>
            <DropdownArrow width={10} height={6} />
          </div>
        </div>
      </div>
      {isOpen && <div className='flex gap-3 flex-wrap'>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onClose: () => {
            setIsOpen(true);
            // setIsOpen(false);
          } })
        )}
      </div>}
    </div>
  )
}
