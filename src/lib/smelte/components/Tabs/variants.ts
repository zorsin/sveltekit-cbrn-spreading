export default {
  all: (color: string): string[] => [
    `bg-${color}-50`,
    `bg-${color}-700`,
    `hover:bg-${color}-transLight`,
    `hover:${color}-900`,
  ],
};
