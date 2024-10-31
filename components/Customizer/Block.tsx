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
    >
      <div className="options-image flex align-v-center justify-center">
        {!!prod?.images?.edges
          .length ? (
          <img
            className="image"
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
  )
}
