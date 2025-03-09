import React, { useState } from 'react'
import Link from 'next/link'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

interface MegaMenuProps {
  data: any
}

const MegaMenu = ({ data }: MegaMenuProps) => {
  const theme = useGetTheme();
  const [hoverImage, setHoverImage] = useState<any>(data?.megaMenu[0])

  const imageChange = (index: number) => {
    setHoverImage(data?.megaMenu[index])
  }

  return (
    <div className="mega-menu">
      <div
        style={{
          backgroundImage: `url("${theme=== 'dark' ? hoverImage?.blackThemeImage : hoverImage?.whiteThemeImage}")`,
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
              {theme === 'dark' ? !!items?.blackThemeImage && (
                <img src={items?.blackThemeImage} alt={items?.title} />
              ) : !!items?.whiteThemeImage && (
                <img src={items?.whiteThemeImage} alt={items?.title} />
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
    </div>
  )
}

export default MegaMenu
