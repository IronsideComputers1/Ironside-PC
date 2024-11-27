import classNames from 'classnames'
import React from 'react'

export const Separator = ({ theme }: { theme : "dark" | "light"}) => {
  return (
    <hr
      className={classNames(
        "h-0 w-full my-1 border-t-0 border-b",
        {
          "border-primary": theme === "dark",
          "border-light": theme === "light",
        }
      )}
    />
  )
}
