import React, { useState } from 'react'
import classNames from 'classnames'
import { ToastContainer, toast, Flip } from 'react-toastify'
import Image from 'next/image'
import { Portal } from '@reach/portal'

import { useUI } from '@components/ui/context'
import { ProductInfoModal } from '@components/product'
import Info from '@components/icons/Info'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

import { ProductAmountSelect } from './ProductBlock/ProductAmountSelect'
import { ProductBody } from './ProductBlock/ProductBody'
import EmptyProduct from '@components/icons/EmptyProduct'
import { ModalData } from './types'
import { BottomSheet } from './BottomSheet'
import { ProductInfoContent } from '@components/product/ProductInfoModal/ProductInfoModal'

interface ColorSelectionData {
  entityId: string
  categories: { edges: { node: { name: string } }[] }
  prices: { price: { value: number } }
}

interface ColorOption {
  entityId: string
  variants: { edges: { node: { inventory: { isInStock: boolean } } }[] }
  prices: { price: { value: number } }
  name: string
}

interface ColorSelection {
  entityId: string
  categoryName: string
  price: number
  color: ColorOption
}

interface ProductSelectionModalProps {
  setModal: (arg: boolean) => void
  modalData: ModalData
  selectedIds: { product: string; cat: string }[]
  onOptionSelections: any
  selectedColor: {
    parent_id: string
    productPrice: number
    product_name: string
    product_id: string
  }[]
  colorOpts: ColorOption[]
  convertCurrency: (value: number) => string
  setIncompatibleProducts: (products: Record<string, unknown>) => void
  incompatibleProdIds: string[]
  setIncompatibleProdIds: any
  setIncompatibleCats: any
  optionSelections: { category_name: string; productPrice: number }[]
  defaultColors: ColorSelection[]
  setDefaultColors: any
  onClose?: () => void
}

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
  defaultColors,
  setDefaultColors,
  onClose,
}: ProductSelectionModalProps) => {
  const { displayModal, closeModal } = useUI()
  const [toggle, setToggle] = useState(false)
  const [toggleIndex, setToggleIndex] = useState('')
  const theme = useGetTheme()
  let isMerch = false

  modalData?.products?.[1]?.categories?.edges?.forEach((ele: any) => {
    if (ele.node.name === 'Merch') isMerch = true
  })
  const notify = () => {
    toast.error('Insufficient stock')
  }

  const handleColorSelection = (
    data: ColorSelectionData,
    color: { node: { value: string } }
  ) => {
    const selectedValue = color?.node?.value.split(',')[2]
    const selectedOption = colorOpts?.find(
      (option: ColorOption) => option.entityId.toString() === selectedValue
    )

    // Handle out of stock
    if (!selectedOption?.variants.edges[0].node.inventory.isInStock)
      return notify()

    // Get category by name
    const category = defaultColors?.find(
      (color: ColorSelection) =>
        color.categoryName === data?.categories?.edges[0]?.node?.name
    )

    const finalColors = []
    // Handle is new category
    if (typeof category === 'undefined' || !category) {
      const newCategoryWithValue = {
        entityId: data?.entityId,
        categoryName: data?.categories?.edges[0]?.node?.name,
        price: data?.prices.price.value,
        color: selectedOption,
      }
      finalColors.push([...defaultColors, newCategoryWithValue])
    }
    // Handle already has category
    if (category && !!category.categoryName) {
      // Replace old value by new selected value
      const colorSelection = defaultColors.map((color: ColorSelection) => {
        if (color?.categoryName !== category?.categoryName) return color
        return {
          ...color,
          color: selectedOption,
        }
      })
      finalColors.push([...colorSelection])
    }

    setIncompatibleProducts({})
    setIncompatibleProdIds([])
    setIncompatibleCats([])
    onOptionSelections(
      data?.entityId,
      modalData?.categoryName,
      selectedOption?.prices.price.value,
      selectedOption
    )
    setToggle(false)
    setModal(false)
    if (onClose) onClose()
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
    let variantPrice = 0
    if (selectedColor?.length) {
      selectedColor.forEach((color: any) => {
        if (color?.parent_id === data?.entityId) {
          variantPrice = color.productPrice
        } else {
          if (data?.customFields?.edges?.length) {
            colorOpts?.forEach((options: any) => {
              if (
                data?.customFields?.edges[0]?.node?.value?.split(',')[2] ==
                options?.entityId
              ) {
                variantPrice =
                  options?.prices.price.value - data?.prices?.price?.value
                selectedColor.forEach((ele: any) => {
                  if (ele?.parent_id === data?.entityId) {
                    variantPrice =
                      options?.prices.price.value - ele?.productPrice
                    if (ele?.product_name === options?.name) {
                      variantPrice = 0
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
    const finalPrice = price + variantPrice
    return (
      <p
        className="font-bold w-auto h-7 py-2 px-2.5 rounded-full bg-opacity-5 flex items-center justify-center text-2xs text-primary-2"
        style={{
          backgroundColor: theme === 'dark' ? '#1c1c1c' : 'rgba(0, 0, 0, 0.05)',
        }}
      >
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
    setModal(false)
    if (onClose) onClose()
  }

  const onSetProduct = (data: any) => {
    if (data?.variants.edges[0]?.node?.inventory?.isInStock) {
      return setProduct(data)
    }
    return notify()
  }

  return (
    <div className="category-popup mt-1">
      <div className="flex flex-wrap pb-3 gap-2 justify-center max-w-3xl xs:justify-start">
        {modalData?.products?.map((data: any, index: number) => {
          // const maxLength = 48;
          // const dataName = data?.name.split(" ").join("").length > maxLength
          //   ? `${data?.name?.substring(0, maxLength)}...`
          //   : data?.name
          const dataName = data?.name
          const customFields = data?.customFields?.edges
          const hasImage = data?.images?.edges.length > 0
          const hasProduct = data?.customFields?.edges.length === 0 || isMerch
          const imageUrl = hasProduct
            ? data?.images?.edges[0]?.node?.urlOriginal
            : loadImage(data)
          const isSelected = selectedIds?.some(
            (product: any) =>
              product?.product === data?.entityId &&
              product?.cat === modalData?.categoryName
          )
          console.log({ data })

          return (
            <div
              key={index}
              className={classNames(
                'min-w-[48%] max-w-[148px] md:max-w-[198px] md:min-w-[unset] md:w-56',
                {
                  'stock-out cursor-not-allowed pointer-events-none opacity-25':
                    !data?.variants?.edges[0]?.node?.inventory?.isInStock,
                }
              )}
            >
              <div
                className={classNames(
                  'border-[1px] rounded-2xl w-auto h-[234px] min-h-full md:h-auto flex items-start justify-between p-2 md:p-3 flex-col relative overflow-hidden md:w-auto',
                  'hover:outline hover:outline-2',
                  {
                    'border-dark hover:outline-dark': theme === 'dark',
                    'border-light hover:outline-light': theme === 'light',
                  },
                  {
                    'outline outline-2': isSelected,
                    'outline-dark': isSelected && theme === 'dark',
                    'outline-light': isSelected && theme === 'light',
                  }
                )}
              >
                {/* Desktop */}
                <div className="hidden self-end md:block">
                  <ProductInfoModal
                    open={displayModal}
                    onClose={closeModal}
                    heading={data?.name}
                    text={data?.description}
                    button={
                      <Info
                        height={18}
                        width={18}
                        className={`fill-current ${
                          theme === 'dark'
                            ? 'text-icon-gray'
                            : 'text-icon-gray-light'
                        }`}
                      />
                    }
                    dataImages={data?.images?.edges}
                    stock={data?.variants?.edges[0]?.node?.inventory?.isInStock}
                  />
                </div>
                {/* Responsive */}
                <div className="flex justify-end w-full self-end md:hidden">
                  <BottomSheet
                    content={
                      <ProductInfoContent
                        heading={data?.name}
                        text={data?.description}
                        dataImages={data?.images?.edges}
                      />
                    }
                  >
                    <Info
                      height={18}
                      width={18}
                      className="fill-current text-icon-gray"
                    />
                  </BottomSheet>
                </div>

                {/* IMAGE */}
                <div
                  className="flex items-center justify-center w-full"
                  onClick={() => {
                    if (hasProduct || !hasImage) return onSetProduct(data)
                    setToggleIndex(index.toString())
                    setToggle(true)
                  }}
                >
                  {hasImage ? (
                    <Image
                      width="130px"
                      height="130px"
                      src={imageUrl}
                      objectFit="contain"
                    />
                  ) : (
                    <EmptyProduct />
                  )}
                </div>
                <div className="flex flex-direction justify-space w-full">
                  {/* TITLE */}
                  <span
                    className="md:mt-3 pt-2 pb-0 px-1.5 font-Arimo text-[13px] overflow-hidden line-clamp-2 min-h-9"
                    onClick={() => {
                      if (customFields.length > 0 && !isMerch) return null
                      onSetProduct(data)
                    }}
                  >
                    {dataName}
                  </span>
                  <div className="h-8 flex item s-center justify-between md:mt-4">
                    <ProductBody
                      data={data}
                      renderColorPrice={renderColorPrice}
                      selectedIds={selectedIds}
                      modalData={modalData}
                      convertCurrency={convertCurrency}
                      renderPrice={renderPrice}
                      toggle={toggle}
                      isCurrentIndex={parseInt(toggleIndex) === index}
                      setToggle={setToggle}
                      customFields={data?.customFields?.edges}
                      handleColorSelection={handleColorSelection}
                      colorOpts={colorOpts}
                      isMerch={isMerch}
                    />
                    <ProductAmountSelect
                      data={data}
                      index={index}
                      setToggle={setToggle}
                      setToggleIndex={setToggleIndex}
                      selectedIds={selectedIds}
                      modalData={modalData}
                      renderColorName={renderColorName}
                      renderPrice={renderPrice}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
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
