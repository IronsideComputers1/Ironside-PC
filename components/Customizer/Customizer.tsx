import { FC, useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ToastContainer, Flip, toast } from 'react-toastify'
import { Portal } from '@reach/portal'
import useAddItem from '@framework/cart/use-add-item'
import type { ProductNode } from '@framework/api/operations/get-product'
import { Button } from '@components/ui'
import EmptyProduct from '@components/icons/EmptyProduct'
import SaveBuildModal from '@components/ui/SaveBuildModal/SaveBuildModal'
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

interface Props {
  className?: string
  children?: any
  product: ProductNode
  categoriesDataFiltered: any
  checkThemeColor: any
  themeColor: boolean
  colorOpts?: number[]
  currency?: any
  productsFetched?: boolean
}

declare let window: any

const Cutomizer: FC<Props> = (props) => {
  const {
    product,
    categoriesDataFiltered,
    checkThemeColor,
    themeColor,
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
  console.log({categoriesDataFiltered});
    
  const [basePrice, setBasePrice] = useState<number>(0)
  const [modalData, setModalData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<string>('Aesthetics')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [saveMyBuildModal, setSaveMyBuildModal] = useState(false)
  const [incompatibleModal, setIncompatibleModal] = useState(false)
  const [cartIndex, setCartIndex] = useState<any>('')
  const [gridView, setGridView] = useState('gridview')
  const [buildUrl, setBuildUrl] = useState('')
  const [incompatibleProducts, setIncompatibleProducts] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [incompatibleCats, setIncompatibleCats] = useState([])
  const [incompatibleProdIds, setIncompatibleProdIds] = useState([])
  const [defaultColors, setDefaultColors] = useState([])

  const addItem = useAddItem()
  const { data: cartData }: any = useCart()
  const removeItem = useRemoveItem()
  const router = useRouter()

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
  const legacyImages =
    product && product.images?.length
      ? product.images?.map((item: any) => ({
          node: { urlOriginal: item.url_standard, altText: product?.name },
        }))
      : null

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

  const scrollToElement = (heading: string, isModalSelection?: boolean) => {
    setTimeout(() => {
      setActiveTab(heading)
      const scrollElement: any = document.getElementById(
        `${heading?.replace(/[ ,:]+/g, '-')}`
      )
      const targetPosition = scrollElement?.offsetTop

      if (targetPosition) {
        const element: any = document.getElementById('scroll-box')
        element.scrollTo({
          top: targetPosition - 298,
          behavior: isModalSelection ? 'auto' : 'smooth',
        })
      }
    }, 1)
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
      
      <div className="customizer">
        <div
          className="customizer-product flex flex-wrap align-v-center"
          data-lenis-prevent
        >
          <ProductLeft
            products={product.images?.edges}
            modalImage={modalImage}
          />

          <div className="customizer-product-content">
            {/* TODO: move this to header */}
            {/* <p
              className="themeColorChanger flex align-center justify-center mb-0 cursor-pointer"
              onClick={() => checkThemeColor(themeColor ? false : true)}
            >
              {themeColor == false ? <Moon /> : <Sun />}
            </p> */}

            <div className="components w-100">
              <div className="default-options" id={'scroll-box'}>
                <div className="head flex justify-center items-center w-100">
                  <h1 className="text-center">{productDescription[0]?.trim()}</h1>
                  <p className="mb-0">{productDescription[1]?.trim()}</p>
                </div>

                <div>
                  <div className="customizerProductGrid">
                    {!!selectedIds?.length &&
                      categoriesDataFiltered?.map((categories: any) => (
                        <>
                          <h2
                            id={categories?.categoryName}
                            className="text-center text-base weight-700"
                          >
                            {categories?.categoryName}
                          </h2>
                          <div className="grid-view flex flex-wrap border	rounded-lg px-11 py-3">
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
                                          <>
                                            <Block 
                                              prod={prod}
                                              subs={subs}
                                              incompatibleCats={incompatibleCats}
                                              onModalSelection={onModalSelection}
                                              loadImage={loadImage}
                                              renderColorName={renderColorName}
                                            />
                                            {index !== categories?.subCategory?.length - 1 && (
                                              <hr className="h-0 w-full my-1 border-t-0 border-b border-primary" />
                                            )}
                                          </>
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
                {/* {modal ? (
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
                ) : (
                  <div>
                    <div className="grid-btns flex justify-end">
                      <button
                        className={`${gridView == 'gridview'}`}
                        onClick={() => setGridView('gridview')}
                      >
                        <GridIcon />
                      </button>
                      <button
                        onClick={() => setGridView('listview')}
                        className={`${gridView == 'listview'}`}
                      >
                        <ListIcon />
                      </button>
                    </div>
                    <div className="customizerProductGrid">
                      {!!selectedIds?.length &&
                        categoriesDataFiltered?.map((categories: any) => (
                          <>
                            <h2
                              id={categories?.categoryName}
                              className="content-item"
                            >
                              {categories?.categoryName}
                            </h2>
                            <div
                              className={`${
                                gridView == 'gridview' ? 'grid' : 'list'
                              }-view flex flex-wrap`}
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
                                            <div
                                              className={`flex flex-wrap align-v-center ${
                                                incompatibleCats?.some(
                                                  (cat: any) =>
                                                    cat ===
                                                    subs.categoryName
                                                ) && 'incompatible'
                                              }`}
                                              key={index}
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
                )} */}
              </div>

              <div className="customizer-total flex justify-space align-self-start align-center">
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
                {Object.keys(incompatibleProducts).length ? (
                  <Button
                    aria-label="Add to Cart"
                    type="button"
                    className="btn add-to-cart incompatibilities-btn"
                  >
                    <WrongPassword />
                    Fix Incompatibilities
                  </Button>
                ) : (
                  <Button
                    aria-label="Add to Cart"
                    type="button"
                    className="btn add-to-cart"
                    onClick={addToCart}
                    loading={loading}
                    disabled={!variant}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
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
      {incompatibleModal && (
        <IncompatibilitesModal
          incompatibleProducts={incompatibleProducts}
          setIncompatibleModal={setIncompatibleModal}
          selectedIds={optionSelections}
          categoriesDataFiltered={categoriesDataFiltered}
          onModalSelection={onModalSelection}
          setIncompatibleProducts={setIncompatibleProducts}
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

export default Cutomizer
