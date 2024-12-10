import { FC, useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ToastContainer, Flip, toast } from 'react-toastify'
import { Portal } from '@reach/portal'
import useAddItem from '@framework/cart/use-add-item'
import type { ProductNode } from '@framework/api/operations/get-product'
import { Button } from '@components/ui'
import SaveBuildModal from '@components/ui/SaveBuildModal/SaveBuildModal'
import SaveMyBuild from './SaveMyBuild'
import axios from 'axios'
import WrongPassword from '@components/icons/WrongPassword'
import usePrice from '@commerce/use-price'
import useCart from '@framework/cart/use-cart'
import useRemoveItem from '@framework/cart/use-remove-item'

import IncompatibilitesModal from './IncompatibilitesModal'
import { OptionSelectionController } from './OptionSelectionController'
import { Error404 } from './Error404'
import { Block } from './Block'
import { ProductLeft } from './ProductLeft'
import { getCurrentVariant } from '../product/helpers'
import { ItemBody } from '@framework/api/wishlist'
import ProductSelectionModal from './ProductSelectionModal'
import { Floppy } from '@components/icons'
import { Scroller } from './Scroller'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
import classNames from 'classnames'
import { Separator } from './Separator'
import { Video } from '@components/ui/Video/Video'
import { ShadowFocus } from './ShadowFocus'
import { VideoBG } from './Video-BG'

interface Props {
  className?: string
  children?: any
  product: ProductNode
  categoriesDataFiltered: any
  colorOpts?: number[]
  currency?: any
  productsFetched?: boolean
}

declare let window: any

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
  const [saveMyBuildModal, setSaveMyBuildModal] = useState(false)
  const [incompatibleModal, setIncompatibleModal] = useState(false)
  const [cartIndex, setCartIndex] = useState<any>('')
  const [buildUrl, setBuildUrl] = useState('')
  const [incompatibleProducts, setIncompatibleProducts] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [incompatibleCats, setIncompatibleCats] = useState([])
  const [incompatibleProdIds, setIncompatibleProdIds] = useState([])
  const [defaultColors, setDefaultColors] = useState([])
  
  const theme = useGetTheme();

  const addItem = useAddItem()
  const { data: cartData }: any = useCart()
  const removeItem = useRemoveItem()
  const router = useRouter()

  const scrollToElement = (heading: string) => {
    const element = document?.getElementById(heading);
    if (!element) return;
    console.log('scrollToElement');
    element.scrollIntoView({ behavior: "smooth" });
  }

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

  // @ts-ignore next-line
  // const legacyImages =
  //   product && product.images?.length
  //     ? product.images?.map((item: any) => ({
  //         node: { urlOriginal: item.url_standard, altText: product?.name },
  //       }))
  //     : null

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
    if (selectedWarranty[0]?.product_name && warranty?.length)
      return (
        <div>
          <label>Warranty</label>
          <span className="customizer-total-price">{warranty}</span>
        </div>
      )
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

  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const element: any = document.querySelector('#scroll-box')
        if (element) {
          element.onscroll = function (e: any) {
            const contentBlocks: any =
              document.querySelectorAll('.content-item')
            for (let i = 0; i < contentBlocks?.length; i++) {
              const block = contentBlocks[i] as HTMLElement
              const blockTop = block?.offsetTop
              const blockBottom = blockTop + block?.offsetHeight
              const currentScrollPosition =
                element?.scrollTop + contentBlocks[0]?.offsetTop
              if (
                currentScrollPosition >= blockTop &&
                currentScrollPosition < blockBottom
              ) {
                setActiveTab(block?.innerHTML)
                break
              }
              if (
                element.scrollTop + element.clientHeight >=
                element.scrollHeight
              ) {
                setActiveTab(contentBlocks[contentBlocks?.length - 1].innerHTML)
              }
            }
          }
        }
      }
    }, 8000)
  }, [])
  useEffect(() => {
    {
      /* breadPay rendering on pdp page load */
    }
    if (window.BreadPayments) {
      const placement = [
        {
          financingType: 'installment',
          locationType: 'product',
          domID: 'bread-checkout-btn',
          allowCheckout: false,
          order: {
            items: [],
            subTotal: {
              value: totalPrice,
              currency: 'USD',
            },
            totalTax: {
              value: 0,
              currency: 'USD',
            },
            totalShipping: {
              value: 0,
              currency: 'USD',
            },
            totalDiscounts: {
              value: 0,
              currency: 'USD',
            },
            totalPrice: {
              value: totalPrice,
              currency: 'USD',
            },
          },
        },
      ]
      window.BreadPayments.setup({
        integrationKey: 'a7496808-6bf0-4504-9ab9-42821c807572',
      })
      // console.log('BreadPayments Registered: ', placement)
      window.BreadPayments.registerPlacements(placement)
      window.BreadPayments.on('INSTALLMENT:APPLICATION_CHECKOUT', () => {})
      window.BreadPayments.on('INSTALLMENT:APPLICATION_DECISIONED', () => {})
    } else {
      console.error('BreadPayments is not available on window object')
    }
  }, [])


  if(!productsFetched) {
    return (
      <div className="fallback-loader">
        <span className="loader"></span>
      </div>
    )
  }

  if(categoriesDataFiltered?.length <= 0) {
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
      {productDescription[0]?.trim() === "Eden's Veil Platinum" && <VideoBG />}
      <div className="customizer">
        <div
          className="customizer-product grid grid-cols-2"
          data-lenis-prevent
        >
          <div className='flex items-center justify-center'>
            <ProductLeft
              products={product.images?.edges}
              modalImage={modalImage}
              currentProduct={productDescription[0]?.trim()}
            />
          </div>

          <div 
            className="customizer-product-content mr-13 w-full relative overflow-y-scroll flex justify-end items-start"
            style={{
              maxHeight: "85vh",
            }}
          >
            <div 
              className="components flex items-center justify-center"
              style={{ 
                width: "65%", 
                // width: "86%" 
              }}
            >
              <div
                id='scroll-box'
                className="default-options overflow-y-auto overflow-x-hidden px-0 pr-10" 
              >
                <div className="customizerProductGrid">
                  <div className="head flex justify-center items-center flex-col">
                    <div className='flex justify-center items-center'>
                      {productDescription[0]?.trim() === "Eden's Veil Platinum" ? ( 
                        <Image
                          src={theme === 'dark' ? '/EdensVeilLogoBlack.png' : '/EdensVeilLogoWhite.png'}
                          alt={productDescription[0]?.trim()}
                          width={300}
                          height={100}
                        />) : (
                        <h1 className="text-center">{productDescription[0]?.trim()}</h1>
                      )}
                      <p className="mb-0">{productDescription[1]?.trim()}</p>
                    </div>
                    <hr className="h-0 w-20 my-1 border-t-0 border-b border-primary" />
                  </div>
                  {!!selectedIds?.length &&
                    categoriesDataFiltered?.map((categories: any) => (
                      <>
                        <h2
                          id={categories?.categoryName}
                          className="text-base leading-4 font-semibold mb-5 text-center font-Arimo weight-700 text-basicDark"
                        >
                          {categories?.categoryName}
                        </h2>
                        <div className="grid-view flex flex-wrap border rounded-lg px-11 py-2.5 w-full last:mb-36">
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
                                        <div 
                                          key={index}
                                          className='w-full'
                                        >
                                          <Block 
                                            prod={prod}
                                            subs={subs}
                                            incompatibleCats={incompatibleCats}
                                            onModalSelection={onModalSelection}
                                            loadImage={loadImage}
                                            renderColorName={renderColorName}
                                          >
                                            <ProductSelectionModal
                                              optionSelections={optionSelections}
                                              setIncompatibleProducts={setIncompatibleProducts}
                                              incompatibleProdIds={incompatibleProdIds}
                                              setModal={setModal}
                                              onOptionSelections={onOptionSelections}
                                              modalData={modalData}
                                              selectedIds={selectedIds}
                                              selectedColor={selectedColor}
                                              colorOpts={colorOpts}
                                              defaultColors={defaultColors}
                                              convertCurrency={convertCurrency}
                                              setIncompatibleProdIds={setIncompatibleProdIds}
                                              setIncompatibleCats={setIncompatibleCats}
                                              scrollToElement={scrollToElement}
                                              activeTab={activeTab}
                                              setDefaultColors={setDefaultColors}
                                            />
                                          </Block>
                                          {index !== categories?.subCategory?.length - 1 && (
                                            <Separator theme={theme} />
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

            
            <div
              className="flex items-start fixed right-0.5 bottom-0 py-6 px-5 border-top text-center"
              style={{ 
                backdropFilter: "blur(10px)",
                left: "62%",
                // left: "55%",
                justifyContent: 'space-around'
              }}
            >
              {getWarranty()}
              <div>
                <label>Ships by</label>
                <span className="customizer-total-price">
                  {getShippingDate()}
                </span>
              </div>
              <div>
                <label>Total</label>
                {/* DemoID to render breadPay placement */}
                <span className="customizer-total-price">
                  {convertCurrency(totalPrice)}
                </span>
                <div id="bread-checkout-btn" />
              </div>
              <Button
                aria-label="Add to Cart"
                type="button"
                className={classNames(
                  "btn add-to-cart",
                  Object.keys(incompatibleProducts).length > 0 && "incompatibilities-btn",
                )}
                onClick={addToCart}
                loading={loading}
                disabled={!variant}
              >
                Add to Cart
              </Button>
              <button
                className={
                  classNames(
                    "dark box-border m-0 overflow-visible bg-none appearance-none shadow-none inline-flex justify-center uppercase items-center text-base leading-none font-secondary font-normal text-white bg-button-color text-center border rounded-full py-5 px-2.5 tracking-tighter cursor-pointer transition-all relative w-14 h-14",
                    theme === "dark" ? "text-white" : "text-basicDark", 
                  )
                }
                onClick={() => {
                  SaveMyBuild(
                    optionSelections,
                    selectedColor,
                    setBuildUrl
                  )
                  setSaveMyBuildModal(true)
                }}
              >
                <Floppy className="fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {saveMyBuildModal && (
        <SaveBuildModal
          url={buildUrl}
          options={optionSelections}
          productDescription={productDescription}
          totalPrice={convertCurrency(totalPrice)}
          setSaveMyBuildModal={setSaveMyBuildModal}
          productImage={modalImage[0]?.node?.urlOriginal}
        />
      )}
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
