import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import Portal from '@reach/portal'
import Cross from '@components/icons/Cross'

type Props = {
  anchor: HTMLElement | null
  onClose: () => void
  customFields: any[]
  handleColorSelection: (data: any, color: any) => void
  data: any
  colorOpts: any[]
  renderColorPrice: (options: any, data: any) => React.ReactNode
}

export const FloatingDropdown = ({
  anchor,
  onClose,
  customFields,
  handleColorSelection,
  data,
  colorOpts,
  renderColorPrice
}: Props) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        className="fixed z-50 bg-[#F8F8F8] dark:bg-[#101010] shadow-lg rounded-lg p-4 border border-[#363636]"
        style={{
          top: position.top + 'px',
          left: position.left + 'px',
          maxWidth: '300px'
        }}
      >
        <span className="flex justify-end cursor-pointer text-[#363636] dark:text-white" onClick={onClose}>
          <Cross />
        </span>
        <ul className="list-none">
          {customFields?.map((color: any, index: number) => (
            <li key={index}>
              <p
                className="mb-0 cursor-pointer hover:bg-[#EFEFEF] dark:hover:bg-[#1A1A1A] p-2 rounded flex items-center gap-2 text-[#363636] dark:text-white"
                onClick={() => {
                  handleColorSelection(data, color)
                }}
              >
                <span className="flex-1">
                  {color?.node?.value?.split(',')[0]}
                </span>
                <span className="text-[#363636] dark:text-white">
                  {colorOpts?.map((options: any) => {
                    if (color?.node?.value?.split(',')[2] == options?.entityId) {
                      return renderColorPrice(options, data)
                    }
                  })}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Portal>
  )
}
