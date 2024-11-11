import React, { useEffect, useState } from 'react'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

export const IronSideLogo = ({ whiteThemeLogo, blackThemeLogo }) => {
  return (
    <>
      <img
        className='light-logo block'
        src={whiteThemeLogo}
        alt="logo"
        width="82px"
        height="47px"
      />
      <img
        className='dark-logo block'
        src={blackThemeLogo}
        alt="logo"
        width="82px"
        height="47px"
      />

    </>
  )
}
