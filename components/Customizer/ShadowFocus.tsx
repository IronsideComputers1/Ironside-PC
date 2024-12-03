import React from 'react'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode';

type ShadowFocusProps = {
  width?: string;
  rotate?: string;
  left?: string;
  top?: string;
  bottom?: string;
  height?: string;
}

export const ShadowFocus = (props: ShadowFocusProps) => {
  const theme = useGetTheme();
  return (
    <div
      style={{
        position: "absolute",
        boxShadow: `-350px 8px 300px 200px ${theme === "dark" ? "#101010" : "#ffffff"}`,
        // boxShadow: `-50px 8px 300px 200px ${theme === "dark" ? "#101010" : "#ffffff"}`,
        ...props,
      }}
    />
  )
}
