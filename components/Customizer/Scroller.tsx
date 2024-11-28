import { useGetTheme } from '@components/ui/DarkMode/DarkMode';
import React from 'react'

interface ScrollerProps {
  activeTab: string;
  onScroll: (tab: string) => void;
}

export const Scroller: React.FC<ScrollerProps> = ({ activeTab, onScroll }) => {
  const theme = useGetTheme();
  const tabs = ['Aesthetics', 'Components', 'Services', 'Peripherals'];
  const getTabColor = (tab: string) => {
    if(theme === "light") {
      return activeTab === tab ? { color: "rgba(0, 0, 0, 1)" } :{  color: 'rgba(0, 0, 0, 0.5)' }
    }
    return activeTab === tab ? { color: 'rgba(255, 255, 255, 1)' } : { color: "rgba(255, 255, 255, 0.5)" }
  }
  return (
    <div className="list-none fixed z-10"
      style={{
        bottom: '118px'
      }}
    >
      <ul 
        className='flex items-center h-10 rounded-full w-96 m-0'
        style={{
          backdropFilter: "blur(30px)",
          backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.05)": "rgba(255, 255, 255, 0.05)",
          justifyContent: 'space-evenly'
        }}
      >
        {tabs.map((tab) =>  (
          <li key={tab}>
            <a
              className='cursor-pointer'
              style={getTabColor(tab)}
              onClick={() => { 
                onScroll(tab);
                document?.getElementById(tab)?.scrollIntoView({ behavior: "smooth"});
              }}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
