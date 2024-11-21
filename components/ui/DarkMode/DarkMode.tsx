// @ts-nocheck
"use client";

import { Moon, Sun } from '@components/icons'
import { useCallback, useEffect, useState } from "react";

export const useGetTheme = () => {
  const [theme, setTheme] = useState(global.window?.__theme);
  useEffect(() => {
    const callback = ({ detail: { isDark } }) => {
      setTheme(isDark ? 'dark' : 'light');
    }
    window.addEventListener("darkModeChange", callback);
    return () => {
      window.removeEventListener("darkModeChange", callback);
    }
  }, [theme]);
  return theme;
}

export const DarkMode = () => {
  const [theme, setTheme] = useState(global.window?.__theme);
  const isDark = theme === 'dark';
  const toggleTheme = () => {
    if(isDark) {
      global.window?.__setPreferredTheme('light');
      setTheme('light');
    }
    if(!isDark) {
      global.window?.__setPreferredTheme('dark');
      setTheme('dark');
    }
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  const icon = isDark ? <Sun height={21} width={21} /> : <Moon height={21} width={21} />;
  window.dispatchEvent(new CustomEvent("darkModeChange", {
    detail: {
      isDark
    }
  }));
  return <button onClick={toggleTheme}>{icon}</button>;
}

const code = function () {
  window.__onThemeChange = function () {};

  function setTheme(newTheme) {
    window.__theme = newTheme;
    preferredTheme = newTheme;
    document.documentElement.dataset.theme = newTheme;
    window.__onThemeChange(newTheme);
  }

  var preferredTheme;

  try {
    preferredTheme = localStorage.getItem('theme');
  } catch (err) {}

  window.__setPreferredTheme = function (newTheme) {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (err) {}
  };

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  darkQuery.addEventListener('change', function (e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light');
  });

  setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
};

export const getTheme = `(${code})();`;

export default DarkMode;
