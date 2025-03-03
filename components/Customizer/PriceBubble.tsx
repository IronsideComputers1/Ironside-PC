import { useGetTheme } from '@components/ui/DarkMode/DarkMode'

type PriceBubbleProps = {
  children: React.ReactNode
}

export const PriceBubble = ({ children }: PriceBubbleProps) => {
  const theme = useGetTheme();
  console.log({children});

  if (!children ||
      children === '' ||
      children === '0' ||
      (Array.isArray(children) && children.length === 0)) return null
  return (
      <p
        className="font-[700] w-auto m-0 h-7 py-2 px-2.5 rounded-full bg-opacity-5
        flex items-center justify-center text-[11px] leading-none text-white/50 font-Arimo"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </p>
  )
}
