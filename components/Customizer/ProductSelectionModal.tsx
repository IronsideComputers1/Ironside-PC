import React, { useState } from 'react'
import { Portal } from '@reach/portal'
import { ToastContainer, toast, Flip } from 'react-toastify'
import { Cross } from '@components/icons'
import { useUI } from '@components/ui/context'
import { ProductInfoModal } from '@components/product'
import EmptyProduct from '@components/icons/EmptyProduct'
import DropdownArrow from '@components/icons/DropdownArrow'
import Image from 'next/image'
import classNames from 'classnames'
import Info from '@components/icons/Info'

const ProductSelectionModal = ({
  setModal,
  modalData,
  selectedIds,
  onOptionSelections,
  selectedColor,
  colorOpts,
  convertCurrency,
  setIncompatibleProducts,
  incompatibleProdIds,
  setIncompatibleProdIds,
  setIncompatibleCats,
  optionSelections,
  scrollToElement,
  activeTab,
  defaultColors,
  setDefaultColors,
}: any) => {
  const { displayModal, closeModal } = useUI()
  const [toggle, setToggle] = useState(false)
  const [toggleIndex, setToggleIndex] = useState('')
  const productInfoImages = (data: any) => {
    const images = data?.images?.edges.map((image: any) => {
      return image?.node?.urlOriginal
    })
    return images
  }
  let isMerch = false

  modalData?.products[1]?.categories?.edges?.forEach((ele: any) => {
    if (ele.node.name === 'Merch') isMerch = true
  })
  const notify = () => {
    toast.error('Insufficient stock')
  }

  const handleColorSelection = (data: any, color: { node: any }) => {
    let isStockOut = false
    colorOpts?.forEach((option: any) => {
      if (option.entityId == color?.node.value.split(',')[2]) {
        if (!option?.variants.edges[0].node.inventory.isInStock) {
          isStockOut = true
          notify()
          return
        } else {
          const colorSelection = [...defaultColors]
          colorSelection?.forEach((clr: any) => {
            if (clr?.entityId === data?.entityId) clr['color'] = option
          })
          const hasMemoryCategory = colorSelection?.some(
            (item: any) =>
              item.categoryName === data?.categories?.edges[0]?.node?.name
          )
          if (!hasMemoryCategory) {
            const temp = {
              entityId: data?.entityId,
              categoryName: data?.categories?.edges[0]?.node?.name,
              price: data?.prices.price.value,
              color: option,
            }
            colorSelection.push(temp)
            setDefaultColors([...colorSelection])
          } else {
            setDefaultColors([...colorSelection])
          }
          setIncompatibleProducts({})
          setIncompatibleProdIds([])
          setIncompatibleCats([])
          onOptionSelections(
            data?.entityId,
            modalData?.categoryName,
            option?.prices.price.value,
            option
          )
        }
      }
    })
    if (!isStockOut) {
      setToggle(false)
      scrollToElement(activeTab, true)
      setModal(false)
    }
  }

  const renderPrice = (data: any) => {
    let price = 0
    optionSelections?.forEach((option: any) => {
      data?.categories?.edges?.forEach((ele: any) => {
        if (ele?.node?.name === option.category_name) {
          price = data?.prices.price.value - option?.productPrice
        }
      })
    })
    let varaintPrice = 0
    if (selectedColor?.length) {
      selectedColor.forEach((color: any) => {
        if (color?.parent_id === data?.entityId) {
          varaintPrice = color.productPrice
        } else {
          if (data?.customFields?.edges?.length) {
            colorOpts?.forEach((options: any) => {
              if (
                data?.customFields?.edges[0]?.node?.value?.split(',')[2] ==
                options?.entityId
              ) {
                varaintPrice =
                  options?.prices.price.value - data?.prices?.price?.value
                selectedColor.forEach((ele: any) => {
                  if (ele?.parent_id === data?.entityId) {
                    varaintPrice =
                      options?.prices.price.value - ele?.productPrice
                    if (ele?.product_name === options?.name) {
                      varaintPrice = 0
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
    const finalPrice = price + varaintPrice
    return (
      <p className="font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-xs" style={{ backgroundColor: '#1c1c1c' }}>
        {finalPrice?.toString().includes('-')
          ? convertCurrency(finalPrice)
          : `+${convertCurrency(finalPrice)}`}
      </p>
    )
  }

  const renderColorPrice = (options: any, data: any) => {
    let optionAmout = 0
    optionSelections?.forEach((option: any) => {
      data?.categories?.edges?.forEach((ele: any) => {
        if (ele?.node?.name === option.category_name) {
          optionAmout = data?.prices.price.value - option?.productPrice
        }
      })
    })
    let price: any = options?.prices.price.value - data?.prices?.price?.value
    selectedColor.forEach((ele: any) => {
      if (ele?.parent_id === data?.entityId) {
        price = options?.prices.price.value - ele?.productPrice
        if (ele?.product_name === options?.name) {
          price = undefined
        }
      }
    })
    const finalPrice = price + optionAmout
    if (finalPrice?.toString().includes('-')) {
      if (price === undefined) return
      return <span> {convertCurrency(finalPrice)}</span>
    } else {
      if (price === undefined) return
      return <span> +{convertCurrency(finalPrice)}</span>
    }
  }

  const loadImage = (prod: any) => {
    let image = ''
    defaultColors?.forEach((opt: any) => {
      if (prod?.entityId === opt?.entityId) {
        prod?.customFields?.edges.map((field: any) => {
          if (field?.node?.value.split(',')[2] == opt?.color?.entityId) {
            image = opt?.color.images.edges[0].node.urlOriginal
          }
        })
      }
    })
    // selectedColor.forEach((color: any) => {
    //   if (color?.parent_id === prod?.entityId) {
    //     image = color?.product_image
    //   }
    // })
    console.log(prod?.customFields?.edges);
    console.log(prod?.images?.edges[0]?.node);
    
    if (image === '') image = prod?.images?.edges[0]?.node?.urlOriginal
    return image
  }

  const renderColorName = (data: any) => {
    let color: any = {}
    let colorName = data.customFields.edges[0].node.value
    selectedColor?.forEach((ele: any) => {
      data?.customFields?.edges.map((field: any) => {
        if (field?.node?.value.split(',')[2] == ele?.product_id) {
          color = field?.node
        }
      })
    })
    if (color?.entityId) {
      colorName = color?.value
      return colorName
    } else {
      defaultColors?.forEach((opt: any) => {
        if (data?.entityId === opt?.entityId) {
          data?.customFields?.edges.map((field: any) => {
            if (field?.node?.value.split(',')[2] == opt?.color?.entityId) {
              color = field?.node
            }
          })
        }
      })
      if (color?.entityId) {
        colorName = color?.value
      }
      return colorName
    }
  }

  const setProduct = (data: any) => {
    setIncompatibleProducts({})
    setIncompatibleProdIds([])
    setIncompatibleCats([])
    onOptionSelections(
      data?.entityId,
      modalData?.categoryName,
      data?.prices?.price?.value
    )
    scrollToElement(activeTab, true)
    setModal(false)
  }

  const onSetProduct = (data: any) => {
    if(data?.variants.edges[0]?.node?.inventory?.isInStock){
      return setProduct(data);
    }
    return notify();
  }

  const ProductImage = ({ data, index }: { data: any, index: number}) => {
    if (data?.images?.edges.length === 0) {
      return (
        <div
          className="flex items-center justify-center w-full"
          onClick={() => {onSetProduct(data)}}
        >
          <EmptyProduct />
        </div>
      );
    }
    const isFirst = data?.customFields?.edges.length === 0 || isMerch;
    const imageUrl = isFirst ? data?.images?.edges[0]?.node?.urlOriginal : loadImage(data)
    return (
      <div
        className="flex items-center justify-center w-full"
        onClick={() => {
          if (isFirst) return onSetProduct(data);
          setToggleIndex(index.toString())
          setToggle(true)
        }}
      >
        <Image width="130px" height="130px" src={imageUrl} objectFit="contain" />
      </div>
    );
  }

  return (
    <div className="category-popup mt-2">
      <div className="flex flex-wrap pb-3" style={{ gap: "8px" }}>
        {modalData?.products?.map((data: any, index: number) => (
          <div
            className={
              classNames('w-56',{
                "stock-out cursor-not-allowed pointer-events-none opacity-25": !data?.variants?.edges[0]?.node?.inventory?.isInStock
              })
            }
            key={index}
          >
            <div
              className={classNames("border rounded-lg w-56 h-auto flex items-start justify-between p-3 flex-col relative hover:rounded-md hover:border-secondary", 
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
                        className="multiColorOption flex align-v-center justify-space"
                        onClick={() => {
                          setToggle(true)
                          setToggleIndex(index.toString())
                        }}
                      >
                        <>
                          <span
                            className="colorPattelListBg"
                            style={{
                              backgroundColor:
                                renderColorName(data).split(',')[1],
                            }}
                          ></span>
                          {renderColorName(data).split(',')[0]}
                        </>
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
        ))}
      </div>
      <Portal>
        <ToastContainer
          transition={Flip}
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </Portal>
    </div>
  )
}

export default ProductSelectionModal
