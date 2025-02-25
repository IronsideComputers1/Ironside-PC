import { Cross } from '@components/icons'
import React from 'react'

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
    <>
      {toggle && isCurrentIndex && (
        <div className="colorPattelListSelect">
          <span className="flex justify-end" onClick={() => setToggle(false)}>
            <Cross />
          </span>
          <ul className="list-none">
            {customFields?.map((color: any, index: number) => (
              <li key={index}>
                <p
                  className="mb-0"
                  onClick={() => {
                    handleColorSelection(data, color)
                  }}
                >
                  <span
                    className="colorPattelListBg"
                    style={{
                      backgroundColor: color?.node?.value?.split(',')[1],
                    }}
                  />
                  {color?.node?.value?.split(',')[0]}
                  {colorOpts?.map((options: any) => {
                    if (
                      color?.node?.value?.split(',')[2] == options?.entityId
                    ) {
                      return renderColorPrice(options, data)
                    }
                  })}
                </p>
              </li>
            ))}
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
