module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '390px',
        'xxl': '1920px',
        '4-xl': '4096px',
      },
      maxWidth: {
        '8xl': '1920px',
      },
      colors: {
        primary: 'var(--primary)',
        'button-color': 'var(--button-color)',
        'primary-2': 'var(--primary-2)',
        secondary: 'var(--secondary)',
        'secondary-2': 'var(--secondary-2)',
        hover: 'var(--hover)',
        'hover-1': 'var(--hover-1)',
        'hover-2': 'var(--hover-2)',
        'accents-0': 'var(--accents-0)',
        'accents-1': 'var(--accents-1)',
        'accents-2': 'var(--accents-2)',
        'accents-3': 'var(--accents-3)',
        'accents-4': 'var(--accents-4)',
        'accents-5': 'var(--accents-5)',
        'accents-6': 'var(--accents-6)',
        'accents-7': 'var(--accents-7)',
        'accents-8': 'var(--accents-8)',
        'accents-9': 'var(--accents-9)',
        'accents-12': 'var(--accents-12)',
        violet: 'var(--violet)',
        'violet-light': 'var(--violet-light)',
        pink: 'var(--pink)',
        cyan: 'var(--cyan)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        red: 'var(--red)',
        theme: 'var(--theme-bg)',
      },
      borderColor: theme => ({
        ...theme('colors'),
        primary: "#363636",
        dark: "rgba(255, 255, 255, 0.25)",
        light: "rgba(0, 0, 0, 0.25)",
      }),
      outlineColor: theme => ({
        ...theme('colors'),
        primary: "#363636",
        dark: "rgba(255, 255, 255, 0.5)",
        light: "rgba(0, 0, 0, 1)",
      }),
      textColor: {
        primary: 'var(--text-primary)',
        'primary-2': 'var(--primary-2)',
        secondary: 'var(--secondary)',
        "secondary-text": 'var(--text-secondary)',
        basicDark: '#757575',
        "icon-gray": "rgba(255, 255, 255, 0.22)",
        "icon-gray-light": "rgba(0, 0, 0, 0.22)",
      },
      boxShadow: {
        'outline-2': '0 0 0 2px var(--accents-2)',
        magical:
          'rgba(0, 0, 0, 0.02) 0px 30px 30px, rgba(0, 0, 0, 0.03) 0px 0px 8px, rgba(0, 0, 0, 0.05) 0px 1px 0px',
      },
      lineHeight: {
        'extra-loose': '2.2',
      },
      scale: {
        120: '1.2',
      },
      fontFamily: {
        Inconsolata: ['Inconsolata', 'monospace'],
        Arimo: ['Arimo', 'sans-serif'],
        Ramabhadra: ['Ramabhadra','Arimo', 'sans-serif'],
        Secondary: "var(--secondary-fonts)",
      },
      fontSize: {
        "2xs": "11px"
      },
      letterSpacing: {
        'custom-tight': '-1.625px',
      },
      transitionDuration: {
        '50': '50ms',
      },
    },
  },
  plugins: [],
  darkMode: ['selector', '[data-theme="dark"]'],
}
