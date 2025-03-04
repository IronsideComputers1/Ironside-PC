import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface MegaMenuProps {
  data: any
}

const MegaMenu = ({ data }: MegaMenuProps) => {
  const [theme, setTheme] = useState('dark')
  const [hoverImage, setHoverImage] = useState<any>(data?.megaMenu[0])
  let themeAttr = 'dark'


  useEffect(() => {

  }, [themeAttr])

  const imageChange = (index: number) => {
    setHoverImage(data?.megaMenu[index])
  }

  return (
    <div className="mega-menu">
      {theme === 'dark' ? (
        <div
          style={{
            backgroundImage: `url("${hoverImage?.blackThemeImage}")`,
          }}
          className="menu-bg-img"
        >
          <div className="menu-description">
            {data?.megaMenu?.map((items: any, index: number) => (
              <div
                className="mega-menu-content-box"
                onMouseEnter={() => imageChange(index)}
                key={index}
              >
                {!!items?.blackThemeImage && (
                  <img src={items?.blackThemeImage} alt={items?.title} />
                )}
                <h2 className="mega-menu-heading">
                  <Link href={items?.link ? items?.link : '/'}>
                    {items.title}
                  </Link>
                </h2>
                <p className="mega-menu-description">{items.description}</p>
                {items?.sublinks?.length >= 1 && <ul className="mega-menu-sublinks">
                  {items?.sublinks?.map((sublink: any, index: number) => (
                    <li key={index}><a href={sublink.link}>{sublink.title}</a></li>
                  ))}
                </ul>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url("${hoverImage?.whiteThemeImage}")` }}
          className="menu-bg-img"
        >
          <div className="menu-description">
            {data?.megaMenu?.map((items: any, index: number) => (
              <div className="mega-menu-content-box" onMouseEnter={() => imageChange(index)} key={index}>
                {!!items?.whiteThemeImage && (
                  <img src={items?.whiteThemeImage} alt={items?.title} />
                )}
                <h2 className="mega-menu-heading">
                  <Link href={items?.link ? items?.link : '/'}>
                    {items.title}
                  </Link>
                </h2>
                <p className="mega-menu-description">{items.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MegaMenu
