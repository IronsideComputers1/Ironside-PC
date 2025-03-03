import { FC, useRef, useEffect, useState } from 'react'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import Slider from 'react-slick'
import classNames from 'classnames'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
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

export const ProductInfoContent: FC<{
  heading: any,
  text: any,
  dataImages?: any
}> = ({
  heading,
  text,
  dataImages,
}) => {

  const theme = useGetTheme();
  const productInfoImages = () => {
    const images = dataImages.map((image: any) => {
      return image?.node?.urlOriginal
    })
    return images
  }
  const productImages = productInfoImages();


  const [nav1, setNav1] = useState<any>(null)
  const [nav2, setNav2] = useState<any>(null)
  const [slider1, setSlider1] = useState(null)
  const [slider2, setSlider2] = useState(null)

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
  return (
    <div className="modal-content w-full grid grid-cols-1 md:grid-cols-2 pb-10 pl-4 md:pl-13 pt-2">
      <div className="product-thumbnail flex flex-direction justify-center items-center md:ml-10">
        <Slider
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
      <div className="overflow-auto h-auto pt-4 md:pt-6 pr-4 md:pr-20">
        <div>
          <h2>{heading}</h2>
        </div>
        {text && (
          <div data-lenis-prevent>
            <p className={` font-Inconsolata capitalize mt-8 mb-5 text-xl ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Description</p>
            <div className={`${theme === "dark" ? "text-gray-300" : "text-black"} leading-4 font-Inconsolata text-base font-medium`} dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        )}
      </div>
    </div>
  )
};

const ProductInfoModal: FC<Props> = ({
  text,
  button,
  heading,
  open = false,
  stock,
  dataImages,
}: any) => {
  const [showModal, setShowModal] = useState(open);

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
              <div className="modal customizer-prod-modal" data-lenis-prevent>
                <div className={classNames('w-full flex items-center justify-between text-gray-500 h-10 pl-4 pt-4')}>
                  <p
                    className='m-0 font-medium font-Inconsolata'
                    style={{ color: 'rgba(255, 112, 112, 1)' }}
                  >
                  </p>
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close panel"
                    className="m-6 border-common w-7 h-7 px-2 rounded-full flex items-center justify-center mr-3 hover:text-gray-500 transition ease-in-out duration-150 focus:outline-none right-0 top-0"
                  >
                    <Cross className="h-3 w-3 fill-current" />
                  </button>
                </div>
                <ProductInfoContent
                  heading={heading}
                  text={text}
                  dataImages={dataImages}
                />
              </div>
            )}
          </div>
        </div>
      </Portal>
    </>
  )
}

export default ProductInfoModal
