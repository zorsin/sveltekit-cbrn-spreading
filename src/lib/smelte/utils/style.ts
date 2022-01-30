const addUtility = ({
  prop = 'caret-color',
  className = '.caret',
  defaultVariant = 500,
}: Record<string, string | number>): unknown => {
  return ({ e, addUtilities, theme }) => {
    const colors = theme('colors');

    const caretColors = Object.keys(colors).reduce((acc, key) => {
      if (typeof colors[key] === 'string') {
        return {
          ...acc,
          [`${className}-${e(key)}`]: {
            [prop]: colors[key],
          },
        };
      }

      const variants = Object.keys(colors[key]);

      return {
        ...acc,
        [`${className}-${e(key)}`]: {
          [prop]: colors[key][defaultVariant],
        },
        ...variants.reduce(
          (a, variant) => ({
            ...a,
            [`${className}-${e(key)}-${variant}`]: {
              [prop]: colors[key][variant],
            },
          }),
          {},
        ),
      };
    }, {});

    addUtilities(caretColors);
  };
};
export { addUtility };
