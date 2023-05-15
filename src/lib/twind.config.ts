// import { defineConfig } from '@twind/core';
// import presetAutoprefix from '@twind/preset-autoprefix';
// import presetTailwind from '@twind/preset-tailwind';

// const defaultColors = {
//   // primary: '#b027b0',
//   primary: '#164194',
//   // secondary: '#009688',
//   secondary: '#CC4700',
//   error: '#f44336',
//   success: '#4caf50',
//   alert: '#ff9800',
//   blue: '#2196f3',
//   dark: '#212121',
//   // These are material palette colors. You should keep only colors that you're using.
//   // red: '#f44336',
//   // pink: '#e91e63',
//   // purple: '#9c27b0',
//   // 'deep-purple': '#673ab7',
//   // indigo: '#3f51b5',
//   // 'light-blue': '#03a9f4',
//   // cyan: '#00bcd4',
//   // teal: '#009688',
//   // green: '#4caf50',
//   // 'light-green': '#8bc34a',
//   // lime: '#cddc39',
//   // yellow: '#ffeb3b',
//   // amber: '#ffc107',
//   // orange: '#ff9800',
//   // 'deep-orange': '#ff5722',
//   // brown: '#795548',
// };

// /** @type {import('twind').Configuration} */
// export default defineConfig({
//   hash: false,
//   presets: [presetAutoprefix(), presetTailwind()],
//   theme: {
//     extend: {
//       width: {
//         '1/7': '14.2857143%',
//         '2/7': '28.5714286%',
//         '3/7': '42.8571429%',
//         '4/7': '57.1428571%',
//         '5/7': '71.4285714%',
//         '6/7': '85.7142857%',
//       },
//     },
//     fontFamily: {
//       sans: 'Roboto, Arial, sans-serif',
//     },
//     fontSize: {
//       '5xl': '6rem',
//       '4xl': '3.75rem',
//       '3xl': '3rem',
//       '2xl': '2.125rem',
//       xl: '1.5rem',
//       lg: '1.25rem',
//       base: '1rem',
//       sm: '0.875rem',
//       xs: '0.75rem',
//     },
//     breakpoints: {
//       sm: { max: '639px' },
//       md: { max: '767px' },
//       lg: { max: '1023px' },
//       xl: { max: '1279px' },
//     },
//     colors: {
//       transparent: 'transparent',
//       white: '#fff',
//       'white-trans': 'rgba(255,255,255,0.2)',
//       'white-transLight': 'rgba(255,255,255,0.2)',
//       'white-transDark': 'rgba(255,255,255,0.2)',
//       'black-trans': 'rgba(0,0,0,0.2)',
//       'black-transLight': 'rgba(0,0,0,0.2)',
//       'black-transDark': 'rgba(0,0,0,0.35)',
//       'white-500': '#fff',
//       black: '#000',
//       ...buildPalette(defaultColors),
//       gray: {
//         '50': '#fafafa',
//         '100': '#f5f5f5',
//         '200': '#eeeeee',
//         '300': '#e0e0e0',
//         '400': '#bdbdbd',
//         '500': '#9e9e9e',
//         '600': '#757575',
//         '700': '#616161',
//         '800': '#424242',
//         '900': '#212121',
//         trans: 'rgba(250, 250, 250, 0.5)',
//         transLight: 'rgba(250, 250, 250, 0.1)',
//         transDark: 'rgba(100, 100, 100, 0.2)',
//       },
//     },
//   },
//   preflight: {
//     '@font-face': [
//       {
//         fontFamily: 'Roboto',
//         fontWeight: '300',
//         fontDisplay: 'swap',
//         src: `url(/font/roboto-v30-latin-300.woff2) format("woff2")`,
//       },
//       {
//         fontFamily: 'Roboto',
//         fontWeight: '400',
//         fontDisplay: 'swap',
//         src: `url(/font/roboto-v30-latin-regular.woff2) format("woff2")`,
//       },
//       {
//         fontFamily: 'Roboto',
//         fontWeight: '500',
//         fontDisplay: 'swap',
//         src: `url(/font/roboto-v30-latin-500.woff2) format("woff2")`,
//       },
//     ],
//   },
// });
