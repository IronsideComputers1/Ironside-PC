import { useEffect, useState } from "react";
import { useGetTheme } from "../DarkMode/DarkMode"

export const Loader = () => {
  const theme = useGetTheme()
  const [loader, setLoader] = useState("");
  useEffect(() => {
    setLoader(theme === 'dark' ? '/loader-dark-mode.webm' : '/loader-light-mode.webm')
  }, [theme])

  return (
    <div className="fallback-loader">
      <video src={loader} autoPlay muted loop preload="auto" />
    </div>
  )
}
