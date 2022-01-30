export default {
  all: (color: string): string[] => [
    `text-${color}-500`,
    `hover:bg-${color}-trans`,
    `bg-${color}-trans`,
    `hover:bg-${color}-transDark`,
    `hover:bg-${color}-transLight`,
  ],
};
