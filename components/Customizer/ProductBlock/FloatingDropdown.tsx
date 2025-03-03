import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import Portal from '@reach/portal'
import Cross from '@components/icons/Cross'
import { PriceBubble } from '../PriceBubble'
import classNames from 'classnames'

type Props = {
  anchor: HTMLElement | null
  onClose: () => void
  customFields: any[]
  handleProductSelection: (data: any, color: any) => void
  data: any
  colorOpts: any[]
  renderProductPrice: (options: any, data: any) => React.ReactNode
}

export const FloatingDropdown = ({
  anchor,
  onClose,
  customFields,
  handleProductSelection,
  data,
  colorOpts,
  renderProductPrice
}: Props) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selectedProduct = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getProductPrice = (colorOpts: any[], color: any, data: any, index: number) => {
    const result = colorOpts?.map((options: any) => {
      if (color?.node?.value?.split(',')[2] == options?.entityId) {
        return renderProductPrice(options, data)
      }
      return null;
    }).filter(Boolean);
    if (!result?.length) {
      selectedProduct.current = index;
    }
    return result;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchor &&
        !anchor.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [anchor, onClose])

  useLayoutEffect(() => {
    if (!anchor) return
    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
    }

    // Get all scrollable parents
    const getScrollParents = (node: HTMLElement | null): HTMLElement[] => {
      const scrollParents: HTMLElement[] = []

      while (node) {
        const style = window.getComputedStyle(node)
        const { overflow, overflowY, overflowX } = style

        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
          scrollParents.push(node)
        }
        node = node.parentElement
      }

      return scrollParents
    }

    // Initial position
    updatePosition()

    // Add event listeners to all scroll parents
    const scrollParents = getScrollParents(anchor)
    scrollParents.forEach(parent => {
      parent.addEventListener('scroll', updatePosition, { passive: true })
    })

    // Add window event listeners
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)

    // Cleanup
    return () => {
      scrollParents.forEach(parent => {
        parent.removeEventListener('scroll', updatePosition)
      })
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [anchor])

  return (
    <Portal>
      <div
        ref={dropdownRef}
        className="fixed z-50 w-[300px] bg-white dark:bg-[#101010] rounded-lg p-4 border dark:border-white/20 selector-shadow"
        style={{
          top: position.top + 'px',
          left: position.left + 'px',
        }}
      >
        <ul className="list-none">
          {customFields?.map((color: any, index: number) => {
            const isSelected = selectedProduct.current === index;
            return (
              <li key={index}>
                <p
                  className={classNames(
                    'mb-0.5 pl-5 cursor-pointer p-2 rounded-[20px] flex items-center gap-2 text-[#363636] h-10 transition-colors duration-200',
                    'hover:bg-[rgba(0,0,0,0.22)] hover:dark:bg-white/[0.22]',
                    'dark:text-white',
                    {
                      'bg-[rgba(0,0,0,0.22)] dark:bg-white/[0.22]': isSelected,
                      'bg-[rgba(0,0,0,0.05)] dark:bg-white/5': !isSelected
                    }
                  )}
                  onClick={() => {
                    handleProductSelection(data, color)
                  } }
                >
                  <span className="flex-1 text-xs font-Arimo">
                    {color?.node?.value?.split(',')[0]}
                  </span>
                  <PriceBubble>
                    {getProductPrice(colorOpts, color, data, index)}
                  </PriceBubble>
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </Portal>
  )
}
