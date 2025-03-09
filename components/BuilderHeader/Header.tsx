import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { UserNav } from '@components/common'
import MegaMenu from './MegaMenu'
import AboutMenu from './AboutMenu'
import Hamburgers from '@components/icons/Hamburgers'
import MobileMenu from './MobileMenu'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import { IronSideLogo } from '@components/ui/IronSideLogo/IronSideLogo'
import dynamic from 'next/dynamic'

const DarkMode = dynamic(() => import("@components/ui/DarkMode/DarkMode"), {
  ssr: false,
  // Make sure to code a placeholder so the UI doesn't jump when the component loads
  loading: () => <div className="w-9 h-9" />,
});


const Header = (props: any) => {
  const data = props?.headerData
    ? props?.headerData
    : props?.header?.value?.data
  const [menuOpen, setMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const mobileMenu = useCallback(() => {
    setMenuOpen(!menuOpen)
    document.querySelector('body')?.classList.toggle('menu-opened')
  }, [menuOpen])

  return (
    <div className="header h-28 relative">
      {!!props?.sale_banner_text && (
        <div
          className="sale-banner mobile"
          onClick={() => {
            setShowModal(true)
          }}
        >
          <p>{props?.sale_banner_text}</p>
        </div>
      )}
      <div className="relative flex">
        <div className="w-full flex flex-row justify-space pt-5 px-11 items-center">
          <div className="header-left d-flex items-center">
            <Link href="/">
              <a className="logo" aria-label="Logo">
                <IronSideLogo
                  whiteThemeLogo={data?.logo?.whiteThemeLogo}
                  blackThemeLogo={data?.logo?.blackThemeLogo}
                />
              </a>
            </Link>
            <div className='flex items-center gap-4'>
              <span className='block sm:hidden'>
                <DarkMode />
              </span>
              <div className="mobile-menu-btn" onClick={() => mobileMenu()}>
                <Hamburgers />
              </div>
            </div>

            <nav className="hidden ml-6 space-x-4 md:block self-stretch">
              <ul className="h-full list-none d-flex items-stretch gap-12">
                {Object.keys(data?.categories || {}).map(
                  (key: any, index: any) => {
                    return (
                      key !== 'support' && (
                        <li key={index} className={key}>
                          <a
                            href={key === 'laptops' ? '/laptops' : '/'}
                            className="category-heading"
                            role="button"
                          >
                            {key}
                          </a>
                          {key === 'about' && (
                            <AboutMenu data={data?.categories} />
                          )}
                          {!!data?.categories[key].blackThemeImage && (
                            <MegaMenu data={data?.categories[key]} />
                          )}
                        </li>
                      )
                    )
                  }
                )}
              </ul>
            </nav>
          </div>

          {!!props?.sale_banner_text && (
            <div className="sale-banner" onClick={() => setShowModal(true)}>
              <p>{props?.sale_banner_text}</p>
            </div>
          )}

          <div className="header-right d-flex justify-end">
            <UserNav mobileMenu={mobileMenu} />
          </div>
        </div>
      </div>
      <MobileMenu data={data?.categories} mobileMenu={mobileMenu} />
      <Portal>
        <div>
          <div role="dialog" className="sale-dialog">
            {showModal ? (
              <>
                <div className="modal sale-modal flex flex-wrap justify-space items-start">
                  <img src={data?.saleBannerImage} alt={'sale-banner'} />
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close panel"
                    className="modal-close"
                  >
                    <Cross className="h-6 w-6" />
                  </button>
                </div>
                <span onClick={() => setShowModal(false)} />
              </>
            ) : null}
          </div>
        </div>
      </Portal>
    </div>
  )
}

export default Header
