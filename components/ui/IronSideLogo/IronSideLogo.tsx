import React, { useEffect, useState } from 'react'

interface IronSideLogoProps {
  whiteThemeLogo: string;
  blackThemeLogo: string;
}

export const IronSideLogo = ({ whiteThemeLogo, blackThemeLogo }: IronSideLogoProps) =>  (
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
);
