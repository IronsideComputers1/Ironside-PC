import { Cross } from '@components/icons'
import React, { useRef } from 'react'
import { FloatingDropdown } from './FloatingDropdown'

type ProductBodyProps = {
  data: any
  isMerch: boolean
  toggle: boolean
  setToggle: (toggle: boolean) => void
  handleColorSelection: (data: any, color: any) => void
  colorOpts: any
  renderPrice: (data: any) => any
  renderColorPrice: (data: any, color: any) => any
  selectedIds: any
  modalData: any
  isCurrentIndex: boolean
  convertCurrency: (price: number) => string
  customFields: any
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
}: ProductBodyProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)

  if (customFields && customFields.length < 2 && !isMerch) {
    return (
      <div className="flex w-full justify-end">
        {!selectedIds?.some(
          (product: any) =>
            product?.product === data?.entityId &&
            product?.cat === modalData?.categoryName
        ) && renderPrice(data)}
      </div>
    )
  }
  return (
    <div ref={triggerRef}>
      {toggle && isCurrentIndex && (
        <FloatingDropdown
          anchor={triggerRef.current}
          onClose={() => setToggle(false)}
          customFields={customFields}
          handleProductSelection={handleColorSelection}
          data={data}
          colorOpts={colorOpts}
          renderProductPrice={renderColorPrice}
        />
      )}
      {isMerch && (
        <p
          className="font-Arimo font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-2xs"
          style={{ backgroundColor: '#1c1c1c' }}
        >
          {convertCurrency(data?.prices?.price?.value)}
        </p>
      )}
    </div>
  )
}
