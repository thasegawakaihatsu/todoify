import { SafeTailwind, TailwindPrefix } from '@/types/ColorList';

import type { Config } from 'tailwindcss';

const withMT = require('@material-tailwind/react/utils/withMT');

export const RADIX_COLOR_STEP = 12;
export const CUSTOM_COLOR_STEP = 10;

export const white = '#ffffff';
export const black = '#000000';
export const primary = '#208cd8';
export const tigersYellow = '#f7da07';
export const tigersBlack = '#060606';

export const backgroundColor = '#191919';

export const safeColorList = [
  'white-a10',
  'black-a5',
  'black-a6',
  'black-a10',
  'primary-a6',
  'primary-a10',
  'tigersYellow-a6',
  'tigersYellow-a10',
  'tigersBlack-a6',
  'tigersBlack-a10',
  'radixGray-1',
  'radixGray-2',
  'radixGray-a2',
  'radixGray-7',
  'radixGray-a4',
  'radixGray-9',
  'radixGray-12',
  'radixGray-a6',
  'radixSage-5',
  'radixSage-a3',
  'radixSage-12',
  'radixSage-a6',
  'radixOlive-5',
  'radixOlive-a3',
  'radixOlive-11',
  'radixOlive-a5',
  'radixTomato-11',
  'radixTomato-a5',
  'radixRuby-3',
  'radixRuby-10',
  'radixRuby-a4',
  'radixCrimson-11',
  'radixCrimson-a5',
  'radixPlum-4',
  'radixPlum-a2',
  'radixPlum-12',
  'radixPlum-a6',
  'radixViolet-11',
  'radixViolet-a5',
  'radixJade-3',
  'radixJade-12',
  'radixJade-a6',
  'radixGrass-5',
  'radixGrass-a3',
  'radixGrass-10',
  'radixGrass-a4',
  'radixGrass-a4',
  'radixGrass-11',
  'radixSand-10',
  'radixSand-a4',
  'radixIris-9',
  'radixIris-a6',
  'radixGold-10',
  'radixGold-a4',
  'radixBrown-4',
  'radixBrown-a2',
  'radixBrown-12',
  'radixBrown-a6',
  'radixOrange-10',
  'radixOrange-a4',
  'radixLime-4',
  'radixLime-a2',
  'radixLime-12',
  'radixLime-a6',
  'radixMint-3',
  'radixMint-11',
  'radixMint-a5',
  'radixAmber-3',
  'radixAmber-a1',
  'radixAmber-12',
  'radixAmber-a6',
  'radixSky-3',
  'radixSky-a1',
  'radixSky-11',
  'radixSky-a5',
] as const;

const variants: TailwindPrefix[] = [
  'bg-',
  'hover:bg-',
  'text-',
  'border-',
  'ring-',
];

const tailwindSafelist: `"${SafeTailwind}"`[] = [];
for (const color of safeColorList) {
  for (const prefix of variants) {
    const safeColorTailwind = `"${prefix}${color}"`;
    tailwindSafelist.push(safeColorTailwind as `"${SafeTailwind}"`);
  }
}

const config: Config = withMT({
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [`${tailwindSafelist.toString()}`],
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
        minimum: '300px',
        xxs: '360px',
        xs: '480px',
      },
      colors: {
        white: generateCustomeScale(white),
        black: generateCustomeScale(black),
        primary: generateCustomeScale(primary),
        tigersYellow: generateCustomeScale(tigersYellow),
        tigersBlack: generateCustomeScale(tigersBlack),
        radixGray: generateRadixScale('gray'),
        radixMauve: generateRadixScale('mauve'),
        radixSlate: generateRadixScale('slate'),
        radixSage: generateRadixScale('sage'),
        radixOlive: generateRadixScale('olive'),
        radixSand: generateRadixScale('sand'),
        radixTomato: generateRadixScale('tomato'),
        radixRed: generateRadixScale('red'),
        radixRuby: generateRadixScale('ruby'),
        radixCrimson: generateRadixScale('crimson'),
        radixPink: generateRadixScale('pink'),
        radixPlum: generateRadixScale('plum'),
        radixPurple: generateRadixScale('purple'),
        radixViolet: generateRadixScale('violet'),
        radixIris: generateRadixScale('iris'),
        radixIndigo: generateRadixScale('indigo'),
        radixBlue: generateRadixScale('blue'),
        radixCyan: generateRadixScale('cyan'),
        radixTeal: generateRadixScale('teal'),
        radixJade: generateRadixScale('jade'),
        radixGreen: generateRadixScale('green'),
        radixGrass: generateRadixScale('grass'),
        radixBronze: generateRadixScale('bronze'),
        radixGold: generateRadixScale('gold'),
        radixBrown: generateRadixScale('brown'),
        radixOrange: generateRadixScale('orange'),
        radixAmber: generateRadixScale('amber'),
        radixYellow: generateRadixScale('yellow'),
        radixLime: generateRadixScale('lime'),
        radixMint: generateRadixScale('mint'),
        radixSky: generateRadixScale('sky'),
        radixBlack: generateRadixScale('black'),
        radixWhite: generateRadixScale('white'),
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

function generateRadixScale(name: string) {
  let scale = Array.from({ length: RADIX_COLOR_STEP }, (_, i) => {
    let id = i + 1;
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}-a${id})`],
    ];
  }).flat();
  return Object.fromEntries(scale);
}

function generateCustomeScale(color: string) {
  let scale = Array.from({ length: CUSTOM_COLOR_STEP }, (_, i) => {
    let id = i + 1;
    return getCustomOpacity(id, color);
  });
  return Object.fromEntries(scale);
}

function getCustomOpacity(id: number, color: string) {
  switch (id) {
    case 1:
      return [`a${id}`, `${color}1a`];
    case 2:
      return [`a${id}`, `${color}33`];
    case 3:
      return [`a${id}`, `${color}4d`];
    case 4:
      return [`a${id}`, `${color}66`];
    case 5:
      return [`a${id}`, `${color}80`];
    case 6:
      return [`a${id}`, `${color}99`];
    case 7:
      return [`a${id}`, `${color}b3`];
    case 8:
      return [`a${id}`, `${color}cc`];
    case 9:
      return [`a${id}`, `${color}e6`];
    case 10:
      return [`a${id}`, `${color}ff`];
  }
  return ['a10', `${color}ff`];
}
