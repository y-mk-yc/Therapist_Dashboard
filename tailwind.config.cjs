/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#435FE1',
        'secondary': '#D8DDF7',
        'secondary2': '#a1aeec', // #BDC7F3 in designs, but contrast too low
        'tertiary': '#F2F4FB',
        'background-light': '#F8F8F8',
        'accent': '#EF9966',
        'text-dark': '#101010',
        'text': '#50555C',
        'text-light': '#a4a4a4', // #B3B3B3 in designs, but too light


        'positive': '#9AD163',
        'middle': '#F5C14D',
        'negative': '#DD5505'
      },
      backgroundImage: {
        'down-triangle': `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      // Defaults: https://tailwindcss.com/docs/font-size
      fontSize: {
        sm: '0.8rem', //rem is relative to the root fonts size, which is 16px by default
        baseSmaller: '0.95rem', /// Text size is decreased a bit
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      fontFamily: {
        itcedscr: ['ITCEDSCR', 'sans-serif'], // 使用'sans-serif'作为后备字体
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],

}
//https://app.gitbook.com/o/REL98FPBukx16IcHfiMu/s/cxiQvNO8QaRE87UJXRx9/code-bei-zhu-therapist-dashboard/code-bei-zhu-therapist-dashboard/tailwind.config.cjs-wen-jian