import React from 'react'

interface ScrollerProps {
  activeTab: string;
  onScroll: (tab: string) => void;
}

export const Scroller: React.FC<ScrollerProps> = ({ activeTab, onScroll }) => {
  const tabs = ['Aesthetics', 'Components', 'Services', 'Peripherals'];
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
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          justifyContent: 'space-evenly'
        }}
      >
        {tabs.map((tab) =>  (
          <li key={tab}>
            <a
              className='cursor-pointer'
              style={
                activeTab === tab ? { color: 'rgba(255, 255, 255, 1)' } : { color: "rgba(255, 255, 255, 0.5)" }
              }
              onClick={() => { 
                onScroll(tab);
                document?.getElementById(tab)?.scrollIntoView({ behavior: "smooth"})
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
