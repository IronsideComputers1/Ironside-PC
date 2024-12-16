import { Floppy } from '@components/icons'
import classNames from 'classnames'
import React from 'react'

export const SaveBuildButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className={
        classNames(
          "border border-gray-800 hover:bg-theme-bg hover:border-secondary dark:text-white",
          "box-border m-0 overflow-visible bg-none appearance-none shadow-none inline-flex justify-center uppercase items-center text-base leading-none font-normal text-center border-[1px] border-button-color rounded-full py-5 px-2.5 tracking-tighter cursor-pointer transition-all relative w-14 h-14 text-basicDark",
        )
      }
      onClick={onClick}
    >
      <Floppy className="fill-current" />
    </button>
  )
}
