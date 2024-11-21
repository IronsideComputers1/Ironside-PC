import classNames from 'classnames';
import React from 'react'

export const Scroller = ({ activeTab, scrollToElement }) => {
  const tabs = ['Aesthetics', 'Components', 'Services', 'Peripherals'];
  console.log({activeTab});
  
  return (
    <div className="list-none fixed z-10"
      style={{
        bottom: '116px'
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
        {tabs.map((tab) => {
          return (
            <li key={tab}>
              <a
                className='cursor-pointer'
                style={
                  activeTab === tab ? { color: 'rgba(255, 255, 255, 1)' } : { color: "rgba(255, 255, 255, 0.5)" }
                }
                onClick={() => { scrollToElement(tab) }}
              >
                {tab}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  )
}
