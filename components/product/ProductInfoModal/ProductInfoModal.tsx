import { FC, useRef, useEffect, useState } from 'react'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import Slider from 'react-slick'
interface Props {
  text?: any
  button?: any
  heading?: any
  open?: boolean
  stock?: boolean
  onClose: () => void
  onEnter?: () => void | null
  dataImages?: any
}

const ModalContent: FC<{
  heading: any,
  text: any,
  productImages: any,
  settingsMain: any,
  settingsThumbs: any,
  nav1: any,
  nav2: any,
  setSlider1: any,
  setSlider2: any,
  onClose: () => void
}> = ({
  heading,
  text,
  productImages,
  settingsMain,
  settingsThumbs,
  nav1,
  nav2,
  setSlider1,
  setSlider2,
  onClose
}) => (
  <div className="modal customizer-prod-modal" data-lenis-prevent>
    <div className='w-full flex items-center justify-between text-gray-500 border-b border-primary h-12 pl-8'>
      <p className='m-0 text-basicDark font-medium font-Inconsolata'>PRODUCT_OVERVIEW.EXE</p>
      <button
        onClick={onClose}
        aria-label="Close panel"
        className="m-6 border w-7 h-7 px-2 rounded-full flex items-center justify-center mr-3 hover:text-gray-500 transition ease-in-out duration-150 focus:outline-none right-0 top-0"
      >
        <Cross className="h-3 w-3 fill-current" />
      </button>
    </div>
    <div className="modal-content w-full grid grid-cols-1 md:grid-cols-2 pb-10 pl-4 md:pl-13 pt-2">
      <div className="product-thumbnail flex flex-direction justify-center items-center">
        <Slider
          className="product-thumbnail-main"
          {...settingsMain}
          asNavFor={nav2}
          ref={(slider: any) => setSlider1(slider)}
        >
          {productImages?.map((imgSrc: any, index: number) => (
            <div key={index}>
              <img
                src={imgSrc}
                alt={heading}
                height="309px"
                width="400px"
              />
            </div>
          ))}
        </Slider>
        {productImages.length >= 2 && (
          <Slider
            className="product-thumbnails mt-4 md:mt-0"
            {...settingsThumbs}
            asNavFor={nav1}
            ref={(slider: any) => setSlider2(slider)}
          >
            {productImages?.map((imgSrc: any, index: number) => (
              <div key={index}>
                <img
                  height="309px"
                  width="400px"
                  src={imgSrc}
                  alt={heading}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
      <div className="overflow-auto h-auto pt-4 md:pt-12 pr-4 md:pr-20">
        <div>
          <h2>{heading}</h2>
        </div>
        {text && (
          <div data-lenis-prevent>
            <p className='font-mono capitalize mt-8 mb-6 text-xl text-gray-300'>Description</p>
            <div className='font-mono text-gray-300 leading-5' dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        )}
      </div>
    </div>
  </div>
);

const ProductInfoModal: FC<Props> = ({
  text,
  button,
  heading,
  open = false,
  stock,
  dataImages,
}: any) => {
  const [showModal, setShowModal] = useState(open);
  const [nav1, setNav1] = useState<any>(null)
  const [nav2, setNav2] = useState<any>(null)
  const [slider1, setSlider1] = useState(null)
  const [slider2, setSlider2] = useState(null)

  const productInfoImages = () => {
    const images = dataImages.map((image: any) => {
      return image?.node?.urlOriginal
    })
    return images
  }
  const productImages = productInfoImages();

  useEffect(() => {
    setNav1(slider1)
    setNav2(slider2)
  })
  const settingsMain = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav',
  }

  const settingsThumbs = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    swipeToSlide: true,
    focusOnSelect: true,
    infinite: false,
  }

  useEffect(() => {
    const keyDownHandler = (event: {
      key: string
      preventDefault: () => void
    }) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowModal(false)
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  return (
    <>
      <div
        className={
          stock == true
            ? 'stock-checker w-full'
            : 'flex align-v-center justify-space-end stock-out stock-checker w-full'
        }
      >
        {!stock && <p className="out-of-stock-hihglighter">Out Of Stock</p>}
        <span
          className="desc-dots modal-open flex justify-end"
          onClick={() => setShowModal(true)}
        >
          {button}
        </span>
      </div>
      <Portal>
        <div className='relative'>
          <div role="dialog">
            {showModal && (
              <ModalContent
                heading={heading}
                text={text}
                productImages={productImages}
                settingsMain={settingsMain}
                settingsThumbs={settingsThumbs}
                nav1={nav1}
                nav2={nav2}
                setSlider1={setSlider1}
                setSlider2={setSlider2}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      </Portal>
    </>
  )
}

export default ProductInfoModal
