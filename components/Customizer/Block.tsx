import DropdownArrow from '@components/icons/DropdownArrow'
import EmptyProduct from '@components/icons/EmptyProduct'
import React from 'react'

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
  return (
    <div
      className='flex items-center justify-between w-full'
      onClick={() => {
        onModalSelection(subs)
      }}
    >
      {/* TODO: Check incompatible logic */}
    {/* <div
      className={`flex flex-wrap align-v-center w-full ${
        incompatibleCats?.some(
          (cat: any) =>
            cat ===
            subs.categoryName
        ) && 'incompatible'
      }`}
      onClick={() => {
        onModalSelection(subs)
      }}
    > */}
      <div className='flex items-center justify-start w-full'>
        <div className="p-3">
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
          <h3>
            {subs?.categoryName}
          </h3>
          <h4 className="mb-0">
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
      <div className='border w-10 h-10 rounded-full flex items-center justify-center'>
        <DropdownArrow width={14} height={14} />
      </div>
    </div>
  )
}
