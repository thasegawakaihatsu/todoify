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
        tigersYellow: '#f7da07',
        tigersBlack: '#060606',
        radixGray: generateScale('gray'),
        radixMauve: generateScale('mauve'),
        radixSlate: generateScale('slate'),
        radixSage: generateScale('sage'),
        radixOlive: generateScale('olive'),
        radixSand: generateScale('sand'),
        radixTomato: generateScale('tomato'),
        radixRed: generateScale('red'),
        radixRuby: generateScale('ruby'),
        radixCrimson: generateScale('crimson'),
        radixPink: generateScale('pink'),
        radixPlum: generateScale('plum'),
        radixPurple: generateScale('purple'),
        radixViolet: generateScale('violet'),
        radixIris: generateScale('iris'),
        radixIndigo: generateScale('indigo'),
        radixBlue: generateScale('blue'),
        radixCyan: generateScale('cyan'),
        radixTeal: generateScale('teal'),
        radixJade: generateScale('jade'),
        radixGreen: generateScale('green'),
        radixGrass: generateScale('grass'),
        radixBronze: generateScale('bronze'),
        radixGold: generateScale('gold'),
        radixBrown: generateScale('brown'),
        radixOrange: generateScale('orange'),
        radixAmber: generateScale('amber'),
        radixYellow: generateScale('yellow'),
        radixLime: generateScale('lime'),
        radixMint: generateScale('mint'),
        radixSky: generateScale('sky'),
        radixBlack: generateScale('black'),
        radixWhite: generateScale('white'),
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

function generateScale(name: string) {
  let scale = Array.from({ length: 12 }, (_, i) => {
    let id = i + 1;
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}-a${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}
