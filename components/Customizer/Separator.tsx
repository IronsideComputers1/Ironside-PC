import classNames from 'classnames'
import React from 'react'

export const Separator = ({ theme, className }: { theme : "dark" | "light", className?: string}) => {
  return (
    <hr
      className={classNames(
        "h-0 w-full my-1 border-t-0 border-b",
        className,
        {
          "border-dark": theme === "dark",
          "border-light": theme === "light",
        }
      )}
    />
  )
}
