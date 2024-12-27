import classNames from 'classnames'
import React from 'react'
import { ColorOption, CustomFieldEdge, Product, SelectedOption } from '../types';
import { useGetTheme } from '@components/ui/DarkMode/DarkMode';

interface ProductBodyProps {
  data: Product;
  isMerch: boolean;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
  handleColorSelection: (data: Product, color: { node: { value: string } }) => void;
  colorOpts: ColorOption[];
  renderPrice: (data: Product) => JSX.Element;
  renderColorPrice: (data: Product, color: Product) => React.ReactNode;
  selectedIds: { product: string; cat: string; }[];
  modalData: any;
  isCurrentIndex: boolean;
  convertCurrency: (price: number) => string;
  customFields: CustomFieldEdge[];
  selectedOptions?: SelectedOption[];
}

export const ProductBody = ({
  data,
  isMerch,
  toggle,
  isCurrentIndex,
  setToggle,
  handleColorSelection,
  colorOpts,
  renderPrice,
  renderColorPrice,
  selectedIds,
  modalData,
  convertCurrency,
  customFields,
  selectedOptions,
}: ProductBodyProps) => {
    const theme = useGetTheme();
  
  if(customFields && customFields.length < 2 && !isMerch) {
    return (
      <div className="flex w-full justify-end">
        {!selectedIds?.some((product: any) =>
          product?.product === data?.entityId &&
          product?.cat === modalData?.categoryName
        ) && renderPrice(data)}
      </div>)
  }
  
  const selectedOption = selectedOptions?.find(
    (product: any) =>
      product?.parent_id === data?.entityId 
  );
  return (
    <>
      {toggle && isCurrentIndex && (
        <div
          className={classNames("flex justify-center items-center top-0 inset-0 absolute py-1 px-2",
            {
              "bg-white": theme === 'light',
              "bg-accents-24": theme === 'dark'
            }
        )}>
          <ul className="list-none flex flex-col gap-0.5 justify-start h-auto w-full self-start">
            {customFields?.map(
              (field: any, index: number) => {
                const name = field?.node?.value?.split(',')[0];
                const fieldId = field?.node?.value?.split(',')[2];
                const isSelected = selectedOption?.product_id?.toString() === fieldId;
                return (
                  <li
                    key={`${index}-${name}`} 
                    className={classNames(
                      "mb-0 bg-accents-12 h-9 flex items-center justify-between pl-5 pr-2 cursor-pointer rounded-3xl font-Arimo text-xs",
                      {
                        "bg-accents-12": !isSelected,
                        "bg-accents-23": isSelected && theme === 'light',
                        "bg-accents-25": isSelected && theme === 'dark',
                        "hover:bg-accents-23" : theme === 'light',
                        "hover:bg-accents-25" : theme === 'dark',
                      }
                    )}
                    onClick={() => {
                      handleColorSelection(data, field)
                    }}
                  >
                    <span>{name}</span>
                    <span>
                      {colorOpts?.map((option: any) => {
                        if (fieldId !== option?.entityId.toString()) return null;    
                        const price = renderColorPrice(option, data);
                        if (!price) return null;
                        return (
                          <span
                            key={option?.entityId}
                            className="min-w-[60px] cursor-pointer font-bold w-auto h-6 py-0.5 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-2xs text-primary-2 m-0 bg-accents-12"
                          >
                            {price}
                          </span>
                        )
                      })}
                    </span>
                  </li>
                )
              }
            )}
          </ul>
        </div>
      )}
      {isMerch && (
        <p
          className="font-Arimo font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-2xs"
          style={{ backgroundColor: '#1c1c1c' }}
        >
          {convertCurrency(data?.prices?.price?.value)}
        </p>
      )}
    </>
  )
}
