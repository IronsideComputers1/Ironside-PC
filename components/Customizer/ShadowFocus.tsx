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
        // box-shadow: horizontal-offset vertical-offset blur-radius spread-radius color;
        boxShadow: `-9.1vw 0.3vh 30vw 19vw ${theme === "dark" ? "#101010" : "#ffffff"}`,
        // border: "1px solid red",
        ...props,
      }}
    />
  )
}
