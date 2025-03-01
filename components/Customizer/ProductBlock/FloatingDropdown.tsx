import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!anchor) return

    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [anchor])

  return (
    <Portal>
      <div
        className="fixed z-50 bg-white shadow-lg rounded-lg p-4"
        style={{
          top: position.top + 'px',
          left: position.left + 'px',
          maxWidth: '300px'
        }}
      >
        <span className="flex justify-end cursor-pointer" onClick={onClose}>
          <Cross />
        </span>
        <ul className="list-none">
          {customFields?.map((color: any, index: number) => (
            <li key={index}>
              <p
                className="mb-0 cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-2"
                onClick={() => {
                  handleColorSelection(data, color)
                }}
              >
                <span
                  className="w-6 h-6 rounded-full inline-block"
                  style={{
                    backgroundColor: color?.node?.value?.split(',')[1],
                  }}
                />
                <span className="flex-1">
                  {color?.node?.value?.split(',')[0]}
                </span>
                <span>
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
