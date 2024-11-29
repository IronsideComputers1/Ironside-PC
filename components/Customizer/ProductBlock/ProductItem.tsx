import classNames from 'classnames';
import React from 'react'

export const ProductItem = ({ data, selectedIds, }) => {
  return (
    <div
      className={
        classNames('w-56',{
          "stock-out cursor-not-allowed pointer-events-none opacity-25": !data?.variants?.edges[0]?.node?.inventory?.isInStock
        })
      }
    >
      <div
        className={classNames("border rounded-lg w-56 h-auto flex items-start justify-between p-3 flex-col relative hover:rounded-md",
        {
          "hover:border-black": theme === "light",
          "hover:border-secondary": theme === "dark",
        },
        selectedIds?.some(
          (product: any) =>
            product?.product === data?.entityId &&
            product?.cat === modalData?.categoryName
        )
          ? `productSelected ${
              incompatibleProdIds?.some(
                (id: any) => id === data?.entityId
              ) && 'incompatible'
            }`
          : ''
        )}
      >
        <ProductInfoModal
          open={displayModal}
          onClose={closeModal}
          heading={data?.name}
          text={data?.description}
          button={<Info height={18} width={18} className="fill-current text-basicDark" />}
          productImages={productInfoImages(data)}
          stock={data?.variants?.edges[0]?.node?.inventory?.isInStock}
        />
        <ProductImage index={index} data={data} />
        <div className="flex flex-direction justify-space w-full">
          <span className='mt-3 py-2'>
            {data?.customFields?.edges.length === 0 || isMerch ? (
              <div
                key={index}
                onClick={() => {
                  onSetProduct(data);
                }}
              >
                {data?.name.length > 23
                  ? `${data?.name?.substring(0, 23)}...`
                  : data?.name}
              </div>
            ) : (
              <div key={index}>
                {data?.name.length > 23
                  ? `${data?.name?.substring(0, 23)}...`
                  : data?.name}
              </div>
            )}
          </span>

          <div className='h-8 flex item s-center justify-between mt-6'>
            <>
              {data?.customFields?.edges.length < 2 && !isMerch ? (
                <div className="flex w-full justify-end">
                  {!selectedIds?.some(
                    (product: any) =>
                      product?.product === data?.entityId &&
                      product?.cat === modalData?.categoryName
                  ) && renderPrice(data)}
                </div>
              ) : (
                <>
                  {toggle && parseInt(toggleIndex) === index && (
                    <div className="colorPattelListSelect">
                      <span
                        className="flex justify-end"
                        onClick={() => setToggle(false)}
                      >
                        <Cross />
                      </span>
                      <ul className="list-none">
                        {data?.customFields?.edges?.map(
                          (color: any, index: number) => (
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
                                    backgroundColor:
                                      color?.node?.value?.split(',')[1],
                                  }}
                                ></span>
                                {color?.node?.value?.split(',')[0]}
                                {colorOpts?.map((options: any) => {
                                  if (
                                    color?.node?.value?.split(',')[2] ==
                                    options?.entityId
                                  ) {
                                    return renderColorPrice(options, data)
                                  }
                                })}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {isMerch && (
                    <p className="font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-xs" style={{ backgroundColor: '#1c1c1c' }}>
                      {convertCurrency(data?.prices?.price?.value)}
                    </p>
                  )}
                </>
              )}
            </>
            {data?.customFields?.edges?.length >= 2 ? (
              <>
                <button
                  className="multiColorOption flex items-center pl-4"
                  style={{
                    justifyContent: 'space-between',
                  }}
                  onClick={() => {
                    setToggle(true)
                    setToggleIndex(index.toString())
                  }}
                >
                  {renderColorName(data).split(',')[0]}
                  <span className="arrow">
                    <DropdownArrow />
                  </span>
                </button>
                {!selectedIds?.some(
                  (product: any) =>
                    product?.product === data?.entityId &&
                    product?.cat === modalData?.categoryName
                ) && renderPrice(data)}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
