import type { Config } from 'tailwindcss';
const withMT = require('@material-tailwind/react/utils/withMT');

const config: Config = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
        minimum: '300px',
        xxs: '360px',
        xs: '480px',
      },
      colors: {
        primary: '#208cd8',
        dark: '#18191b',
        orange: '#f66b15',
        tomato: '#e54d2e',
        ruby: '#e64566',
        gold: '#978365',
        bronze: 'a#18072',
        brown: '#ad7f58',
        grass: '#46a758',
        mint: '#86ead4',
        sand: '#6f6d66',
        olive: '#697066',
        deepGreen: '#2f693c',
        tigersYellow: '#f7da07',
        tigersBlack: '#060606',
        themeBlack: '#18191b',
        stone: '#1c1917',
      },
      transitionDuration: {
        themeChange: '240ms',
      },
      transitionProperty: {
        drawer:
          'color, background-color, border-color, text-decoration-color, fill, stroke, transform',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
});
export default config;
