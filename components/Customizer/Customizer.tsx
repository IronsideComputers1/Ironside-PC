import { FC, useEffect, useState, useRef, useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ToastContainer, Flip, toast } from 'react-toastify'
import { Portal } from '@reach/portal'
import useAddItem from '@framework/cart/use-add-item'
import type { ProductNode } from '@framework/api/operations/get-product'
import SaveMyBuild from './SaveMyBuild'
import axios from 'axios'
import usePrice from '@commerce/use-price'
import useCart from '@framework/cart/use-cart'
import useRemoveItem from '@framework/cart/use-remove-item'

import IncompatibilitesModal from './IncompatibilitesModal'
import { OptionSelectionController } from './OptionSelectionController'
import { Error404 } from './Error404'
import { Block } from './Block'
import { ProductLeft } from './ProductLeft'
import { getCurrentVariant } from '../product/helpers'
import ProductSelectionModal from './ProductSelectionModal'
import { Scroller } from './Scroller'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
import classNames from 'classnames'
import { Separator } from './Separator'
import { VideoBG } from './Video-BG'
import { FixedBottomBar } from './FixedBottomBar'
import { ShadowFocus } from './ShadowFocus'
import { Loader } from '@components/ui/Loader'

interface Props {
  className?: string
  children?: any
  product: ProductNode
  categoriesDataFiltered: any
  colorOpts?: number[]
  currency?: any
  productsFetched?: boolean
}

const Customizer: FC<Props> = (props) => {
  const {
    product,
    categoriesDataFiltered,
    colorOpts,
    productsFetched,
    currency,
  }: any = props
  const {
    selectedIds,
    selectedColor,
    select,
    optionSelections,
    modalImage,
    onOptionSelections,
    warranties,
    shippingDays,
  } = OptionSelectionController({ product, categoriesDataFiltered })

  const [basePrice, setBasePrice] = useState<number>(0)
  const [modalData, setModalData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<string>('Aesthetics')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [incompatibleModal, setIncompatibleModal] = useState(false)
  const [cartIndex, setCartIndex] = useState<any>('')
  const [buildUrl, setBuildUrl] = useState('')
  const [incompatibleProducts, setIncompatibleProducts] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [incompatibleCats, setIncompatibleCats] = useState([])
  const [incompatibleProdIds, setIncompatibleProdIds] = useState([])
  const [defaultColors, setDefaultColors] = useState([])

  const installmentsPrice = useMemo(
    () => Math.ceil((totalPrice / 23) * 100) / 100,
    [totalPrice]
  )
  const theme = useGetTheme()

  const addItem = useAddItem()
  const { data: cartData }: any = useCart()
  const removeItem = useRemoveItem()
  const router = useRouter()

  const scrollToElement = (heading: string) => {
    const element = document?.getElementById(heading)
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth' })
  }

  const logoDarkImage = product?.customFields?.edges?.find(
    ({ node }: { node: any }) => node.name.includes('dark logo')
  )
  const logoLightImage = product?.customFields?.edges?.find(
    ({ node }: { node: any }) => node.name.includes('light logo')
  )
  const bgVideo = product?.customFields?.edges?.find(
    ({ node }: { node: any }) => node.name.includes('bg video')
  )
  const hasLogoImage = !!(logoDarkImage || logoLightImage)

  // @ts-ignore next-line
  const variant =
    getCurrentVariant(product, {
      size: null,
      color: null,
    }) || product?.variants[0]
  const productDescription = product?.name?.split('|')

  useEffect(() => {
    setTotalPrice(
      selectedIds.reduce(
        (sum: number, product: any) => sum + product?.productPrice,
        basePrice
      )
    )
  }, [selectedIds, select])

  useEffect(() => {
    setBasePrice(product?.variants?.edges[0]?.node?.prices?.price?.value)
    let products: any = []
    let optionDefaultColors: any = []
    const queryParams = { ...router.query }
    const defaultSelection: any = []
    if (queryParams['cIn']) {
      setCartIndex(queryParams['cIn'])
      delete queryParams['cIn']
    }
    delete queryParams['slug']
    if (Object.entries(queryParams).length !== 0) {
      product?.productOptions?.edges.forEach((ele: any) => {
        for (let key in queryParams) {
          if (ele?.node?.entityId == key) {
            ele?.node?.values?.edges.forEach((opt: any) => {
              if (queryParams[key] == opt?.node.entityId) {
                opt.node['isDefault'] = true
                opt.node['category'] = ele?.node?.displayName
                defaultSelection.push(opt?.node)
              } else {
                opt.node['isDefault'] = false
              }
            })
          }
        }
      })
    }

    product?.productOptions?.edges.forEach((node: any) => {
      node?.node?.values?.edges?.forEach((productsCategories: any) => {
        categoriesDataFiltered?.forEach((category: any) => {
          category?.subCategory?.forEach((subs: any) => {
            subs?.products?.forEach((ele: any) => {
              if (
                // default product selection
                productsCategories.node.isDefault &&
                productsCategories.node.productId === ele.entityId
              ) {
                products?.push({
                  entityId: ele.entityId,
                  categoryName: subs.categoryName,
                  price: ele.prices.price.value,
                })
              }
              if (
                productsCategories.node.isDefault &&
                ele?.customFields?.edges?.length
              ) {
                // default color selection
                ele?.customFields.edges.forEach((field: any) => {
                  if (
                    field?.node.value.split(',')[2] ==
                    productsCategories.node.productId
                  ) {
                    colorOpts?.forEach((color: any) => {
                      if (
                        productsCategories.node.productId === color?.entityId
                      ) {
                        products?.push({
                          entityId: ele.entityId,
                          categoryName: subs.categoryName,
                          price: color?.prices.price.value,
                          color,
                        })
                        optionDefaultColors?.push({
                          entityId: ele.entityId,
                          categoryName: subs.categoryName,
                          price: color?.prices.price.value,
                          color,
                        })
                      }
                    })
                  }
                })
              }
            })
          })
        })
      })
    })
    if (products?.length) {
      setDefaultColors(optionDefaultColors)
      products?.forEach((ele: any) => {
        onOptionSelections(ele.entityId, ele.categoryName, ele.price, ele.color)
      })
    }
  }, [categoriesDataFiltered])

  const onModalSelection = (category: any) => {
    setModalData(category)
    setModal(true)
  }

  const convertCurrency = (totalPrice: number) => {
    const { price: total } = usePrice({
      amount: totalPrice,
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    })
    return total
  }

  const addToCart = async () => {
    setLoading(true)
    const productId: any = product?.entityId || product?.id
    const variantId = variant?.id || variant?.node.entityId!
    optionSelections?.forEach((ele: any, index: number) => {
      selectedColor?.forEach((data: any) => {
        if (data?.option_id === ele?.option_id) {
          optionSelections[index] = data
        }
      })
    })
    // const list_price = totalPrice
    const productIds: any = []
    selectedIds?.forEach((prod: any) => {
      optionSelections?.forEach((obj: any) => {
        if (obj?.product_id === prod?.product) {
          productIds.push(obj.product_id)
        }
      })
    })
    try {
      await axios.post(
        `https://fair-conduit-404516.uc.r.appspot.com/iron-side/cart`,
        { productIds },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
      if (cartIndex) {
        const editData = cartData?.line_items.physical_items[cartIndex]
        await removeItem({ id: editData?.id })
      }
      await addItem({
        productId,
        // list_price,
        variantId,
        optionSelections,
      })
      setLoading(false)
      router.push('/cart')
    } catch (errors: any) {
      if (errors?.errors) {
        if (errors.errors[0]?.code === 'insufficient_stock') {
          const stockOutItem = selectedIds.filter((item: any) => {
            return item?.product === +errors.errors[0]?.message.split(' ')[6]
          })
          toast.error(
            `${stockOutItem?.[0]?.cat} is currently out of stock.Please contact customer support for an estimated time of arrival. `
          )
        } else toast.error('Some error occured, please try again later')
        setLoading(false)
        return
      }
      const errData = errors?.response?.data
      if (Object?.keys(errData?.data)?.length) {
        const cats = new Set<any>([])
        const ids = new Set<any>([])
        Object?.keys(errData?.data)?.map((ele: any) => {
          ids.add(parseInt(ele))
          ids.add(errData?.data[ele][1][0]?.product_id)
          cats.add(errData?.data[ele][0][0])
          cats.add(errData?.data[ele][1][0]?.categories[0])
        })
        const products: any = [...ids]
        const incompatCats: any = [...cats]
        setIncompatibleProdIds(products)
        setIncompatibleCats(incompatCats)
        setIncompatibleProducts(errData?.data)
        setIncompatibleModal(true)
      }
      setLoading(false)
    }
  }
  const loadImage = (prod: any) => {
    let image = ''
    selectedColor.forEach((color: any) => {
      if (color?.parent_id === prod?.entityId) {
        image = color?.product_image
      }
    })
    if (image === '') image = prod?.images?.edges[0]?.node?.urlOriginal
    return image
  }

  const getWarranty = () => {
    const selectedWarranty = optionSelections?.filter((cat: any) => {
      if (cat?.category_name === 'Warranty') return cat
    })
    const warranty = warranties(selectedWarranty[0]?.product_name)
    if (selectedWarranty[0]?.product_name && warranty?.length) return warranty
  }

  const renderColorName = (prod: any) => {
    let name = prod?.name
    selectedColor.forEach((color: any) => {
      if (color?.parent_id === prod?.entityId) {
        name = color?.product_name
      }
    })
    return name
  }

  const getShippingDate = () => {
    let today = new Date()
    const selectedShipping = optionSelections?.filter((cat: any) => {
      if (cat?.category_name === 'Assembly Time') return cat
    })
    const days = shippingDays(selectedShipping[0]?.product_name)
    const shippingDay: any = days.split('-')[1] ? days.split('-')[1] : 5
    function addBusinessDays(startDate: string | number | Date, days: number) {
      let count = 0
      let currentDate = new Date(startDate)

      while (count < days) {
        currentDate.setDate(currentDate.getDate() + 1)
        let dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++
        }
      }
      return currentDate
    }
    let futureDate = addBusinessDays(today, shippingDay)
    let formattedDate =
      (futureDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      futureDate.getDate().toString().padStart(2, '0')
    return formattedDate
  }

  if (!productsFetched) {
    return <Loader />
  }

  if (categoriesDataFiltered?.length <= 0) {
    return <Error404 />
  }

  return (
    <>
      <NextSeo
        title={productDescription[0]?.replace(' ', '')}
        description={product.description}
        openGraph={{
          type: 'website',
          title: productDescription[0]?.trim(),
          description: product.description,
          images: [
            {
              url: product?.images?.edges?.[0]?.node.urlOriginal!,
              width: 800,
              height: 600,
              alt: productDescription[0]?.trim(),
            },
          ],
        }}
      />
      <div className="customizer relative p-0 h-[88vh]">
        {!!bgVideo && <VideoBG src={bgVideo.node.value} />}
        <div
          className="customizer-product h-screen xmd:h-auto grid grid-cols-1 xmd:grid-cols-2"
          data-lenis-prevent
        >
          <ProductLeft
            products={product.images?.edges}
            modalImage={modalImage}
            currentProduct={productDescription[0]?.trim()}
          />
          <div className={classNames(
            "customizer-product-content bg-theme mr-0 w-full relative overflow-visible pl-3 pr-0 pb-36 flex justify-end items-start z-[1px]",
            // "customizer-product-content bg-theme mr-0 w-full relative overflow-visible px-3 pb-36 flex justify-end items-start z-[1px]",
            "sm:pt-8 sm:pl-2.5 sm:pr-[18px]",
            "md:-mt-10 md:pr-1.5",
            "xmd:pt-8 xmd:pb-0 xmd:px-0 xmd:max-h-[88vh] xmd:mr-13 xmd:overflow-y-scroll xmd:bg-transparent",
            // "xmd:pt-8 xmd:pb-0 xmd:px-0 xmd:pr-12 xmd:max-h-[88vh] xmd:mr-13 xmd:overflow-y-scroll xmd:bg-transparent",
          )}>
            <div  className="absolute left-0 right-0 -top-[45px] h-20 overflow-x-clip w-screen block xmd:hidden" >
              <div className='block md:hidden'>
                <ShadowFocus
                  rotate="-11deg"
                  top="50px"
                  bottom="unset"
                  left="0"
                  right="0"
                  width="100%"
                  height="0"
                />
              </div>
              <div className='hidden md:block'>
                <ShadowFocus
                  rotate="0deg"
                  top="-50px"
                  bottom="unset"
                  left="0"
                  right="0"
                  width="100%"
                  height="0"
                />
              </div>
              <div className="absolute inset-y-0 bg-theme blur-[10px] -left-[15px] -right-[15px]" />
            </div>
            <div className="components flex items-center justify-center w-full xl:justify-center xmd:w-full xxl:w-[76%] xxl:mr-12">
              <div
                id="scroll-box"
                className="default-options overflow-y-auto overflow-x-hidden px-0 pr-0 xmd:pr-1 max-w-[734px]"
              >
                <div className="customizerProductGrid xs:w-[97%]">
                  <div className="flex justify-center items-center flex-col">
                    <div className="flex justify-center items-center mb-5">
                      {hasLogoImage ? (
                        <Image
                          src={
                            theme === 'dark'
                              ? logoDarkImage.node.value
                              : logoLightImage.node.value
                          }
                          alt={productDescription[0]?.trim()}
                          width={300}
                          height={50}
                        />
                      ) : (
                        <h1 className="text-center">
                          {productDescription[0]?.trim()}
                        </h1>
                      )}
                      <p className="mb-0">{productDescription[1]?.trim()}</p>
                    </div>
                    <hr className="h-0 w-16 my-1 border-t-0 border-b border-primary" />
                  </div>
                  {!!selectedIds?.length &&
                    categoriesDataFiltered?.map((categories: any) => (
                      <>
                        <h2
                          id={categories?.categoryName}
                          className="text-base leading-4 font-semibold mb-5 text-center font-Arimo weight-700 text-basicDark mt-10 sm:mt-20"
                        >
                          {categories?.categoryName}
                        </h2>
                        <div
                          className={classNames(
                            'grid-view flex flex-wrap border-[1px] rounded-lg py-2.5 md:w-[734px] sm:w-full px-4 last:mb-36',
                            // 'grid-view flex flex-wrap border-[1px] rounded-lg py-2.5 w-full px-4 last:mb-36 max-w-[734px]',
                            {
                              'border-dark': theme === 'dark',
                              'border-light': theme === 'light',
                            }
                          )}
                        >
                          {categories?.subCategory?.map(
                            (subs: any, index: number) => (
                              <>
                                {selectedIds?.map((ele: any) =>
                                  subs?.products?.map((prod: any) => {
                                    if (
                                      ele.product === prod.entityId &&
                                      subs.categoryName === ele.cat
                                    ) {
                                      return (
                                        <div key={index} className="w-full">
                                          <Block
                                            prod={prod}
                                            subs={subs}
                                            incompatibleCats={incompatibleCats}
                                            onModalSelection={onModalSelection}
                                            loadImage={loadImage}
                                            renderColorName={renderColorName}
                                          >
                                            <ProductSelectionModal
                                              optionSelections={
                                                optionSelections
                                              }
                                              setIncompatibleProducts={
                                                setIncompatibleProducts
                                              }
                                              incompatibleProdIds={
                                                incompatibleProdIds
                                              }
                                              setModal={setModal}
                                              onOptionSelections={
                                                onOptionSelections
                                              }
                                              modalData={modalData}
                                              selectedIds={selectedIds}
                                              selectedColor={selectedColor}
                                              colorOpts={colorOpts}
                                              defaultColors={defaultColors}
                                              convertCurrency={convertCurrency}
                                              setIncompatibleProdIds={
                                                setIncompatibleProdIds
                                              }
                                              setIncompatibleCats={
                                                setIncompatibleCats
                                              }
                                              setDefaultColors={
                                                setDefaultColors
                                              }
                                            />
                                          </Block>
                                          {index !==
                                            categories?.subCategory?.length -
                                              1 && (
                                            <Separator
                                              className="w-[96.5%]"
                                              theme={theme}
                                            />
                                          )}
                                        </div>
                                      )
                                    }
                                  })
                                )}
                              </>
                            )
                          )}
                        </div>
                      </>
                    ))}
                </div>
              </div>
              <Scroller onScroll={setActiveTab} activeTab={activeTab} />
              {incompatibleModal && (
                <IncompatibilitesModal
                  incompatibleProducts={incompatibleProducts}
                  setIncompatibleModal={setIncompatibleModal}
                  selectedIds={optionSelections}
                  scrollToElement={scrollToElement}
                  setIncompatibleProducts={setIncompatibleProducts}
                />
              )}
            </div>
            <FixedBottomBar
              warranty={getWarranty()}
              shippingDate={getShippingDate()}
              totalPrice={convertCurrency(totalPrice)}
              isIncompatible={Object.keys(incompatibleProducts).length > 0}
              onAddToCart={addToCart}
              isLoading={loading}
              isDisabled={!variant}
              installmentsPrice={installmentsPrice}
              saveMyBuildData={{
                url: buildUrl,
                options: optionSelections,
                productDescription,
                totalPrice: convertCurrency(totalPrice),
                productImage: modalImage[0]?.node?.urlOriginal,
              }}
              onSaveBuild={() => {
                SaveMyBuild(optionSelections, selectedColor, setBuildUrl)
              }}
            />
          </div>
        </div>
      </div>
      <Portal>
        <ToastContainer
          transition={Flip}
          position="bottom-center"
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
    </>
  )
}

export default Customizer
