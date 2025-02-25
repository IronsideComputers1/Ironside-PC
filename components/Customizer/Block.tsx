import DropdownArrow from '@components/icons/DropdownArrow'
import EmptyProduct from '@components/icons/EmptyProduct'
import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

type Props = {
  prod: any
  subs: any
  incompatibleCats: any
  onModalSelection: any
  loadImage: any
  renderColorName: any
  children?: any
}

export const Block = ({
  prod,
  subs,
  incompatibleCats,
  onModalSelection,
  children,
  loadImage,
  renderColorName,
}: Props) => {
  const theme = useGetTheme()
  const blockRef = useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    console.log(target.nodeName)

    if (['svg', 'path'].includes(target.nodeName)) return
    let currentElement: HTMLElement | null = target
    while (currentElement) {
      if (getComputedStyle(currentElement).position === 'fixed') return
      currentElement = currentElement.parentElement
    }

    if (blockRef.current && !blockRef.current.contains(target)) {
      console.log('Clicked outside the component')
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const toggleAccordion = () => {
    setIsOpen(!isOpen)
    onModalSelection(subs)
  }

  const incompatibleItems = incompatibleCats?.some(
    (cat: any) => cat === subs.categoryName
  )
  const hasImages = prod?.images?.edges.length > 0
  return (
    <div
      ref={blockRef}
      id={subs.categoryName.toLowerCase()}
      className="flex flex-col w-full select-none"
    >
      <div
        className={classNames(
          'flex items-center justify-between w-full h-16',
          incompatibleItems && 'incompatible'
        )}
        onClick={toggleAccordion}
      >
        <div className="flex items-center justify-start w-full gap-10">
          <div className="p-2">
            {hasImages ? (
              <img width={44} height={44} src={loadImage(prod)} />
            ) : (
              <EmptyProduct />
            )}
          </div>

          <div className="w-2/3">
            <h3 className="font-Arimo text-base leading-4 text-left capitalize mb-1.5">
              {subs?.categoryName}
            </h3>
            <h4 className="mb-0 font-Inconsolata text-base leading-4 text-basicDark font-normal tracking-normal capitalize overflow-hidden line-clamp-2">
              {renderColorName(prod)}
            </h4>
          </div>
        </div>
        <div
          className={classNames(
            'border w-auto h-9 px-3 rounded-full flex items-center justify-center',
            {
              'transform rotate-180': isOpen,
            }
          )}
        >
          <div
            className={classNames(
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            )}
          >
            <DropdownArrow width={10} height={6} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="flex gap-3 flex-wrap">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClose: () => {
                setIsOpen(false)
              },
            })
          )}
        </div>
      )}
    </div>
  )
}
