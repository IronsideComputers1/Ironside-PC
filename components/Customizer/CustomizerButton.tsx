import React from 'react'
import classNames from 'classnames'
import { LoadingDots } from '@components/ui'

interface CustomizerButtonProps {
  onClick: () => void
  children: React.ReactNode
  isLoading?: boolean
  isDisabled?: boolean
  isIncompatible?: boolean
  className?: string
}

export const CustomizerButton: React.FC<CustomizerButtonProps> = ({
  onClick,
  isLoading,
  isDisabled,
  isIncompatible,
  children,
  className,
}) => {
  const classes = classNames(
    'text-base leading-4 font-secondary font-normal text-center rounded-full min-w-[178px] py-5 px-2.5 tracking-tight cursor-pointer transition-all duration-1000 relative uppercase',
    "xxs:text-sm xxs:min-w-[140px]",
    "xxs:text-sm xs:min-w-[178px]",
    "xxl:w-[226px]",
    'disabled:cursor-not-allowed disabled:bg-transparent disabled:text-secondary-text disabled:opacity-80',
    'dark:bg-button-color dark:text-white font-Secondary tracking-custom-tight',
    {
      'border border-gray-800 hover:bg-theme-bg hover:border-secondary dark:border dark:text-white':
        !isIncompatible,
      'text-[#FF7070] border-[1px] border-[#FF7070] filter-none':
        isIncompatible,
    },
    className
  )
  return (
    <button onClick={onClick} className={classes} disabled={isDisabled}>
      {children}
      {isLoading && (
        <span className="ml-3">
          <LoadingDots />
        </span>
      )}
    </button>
  )
}

export default CustomizerButton
