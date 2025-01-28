import DropdownArrow from '@components/icons/DropdownArrow';
import { useGetTheme } from '@components/ui/DarkMode/DarkMode';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  children: React.ReactNode;
  content: React.ReactNode;
}

export const BottomSheet = ({ children, content }: BottomSheetProps) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const theme = useGetTheme();
  let hideTimeout: NodeJS.Timeout;
  let showTimeout: NodeJS.Timeout;

  const toggleBottomSheet = () => {
    if (visible) {
      setAnimate(false);
      hideTimeout = setTimeout(() => setVisible(false), 300); // Duration should match the CSS transition duration
    } else {
      setVisible(true);
      showTimeout = setTimeout(() => setAnimate(true), 0);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
    };
  }, []);

  return (
    <>
      {/* Trigger */}
      <button onClick={toggleBottomSheet}>
        {children}
      </button>
      {visible && createPortal(
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className={
            classNames(
              "fixed inset-0 bg-black text-gray-500 bg-opacity-50 flex items-end justify-center transition-opacity duration-300",
              {
                "opacity-100": animate,
                "opacity-0 pointer-events-none": !animate
              }
            )
          }
          onClick={toggleBottomSheet}
        >
          <div
            className={classNames("border-[1px] bg-theme w-full p-4 pt-7 rounded-t-2xl relative transition-all duration-300 transform",
              {
                "border-dark hover:outline-dark": theme === "dark",
                "border-light hover:outline-light": theme === "light",
                "min-h-[400px] translate-y-0": animate,
                "min-h-0 translate-y-full": !animate,
              }
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 border w-auto h-6 px-1.5 rounded-full flex items-center justify-center" onClick={toggleBottomSheet}>
              <div className={classNames(theme === "dark" ? 'text-gray-600' : 'text-gray-300')}>
                <DropdownArrow width={10} height={6} />
              </div>
            </button>
            {content}
          </div>
        </div>
      </div>, document.body)}
    </>
  );
};
