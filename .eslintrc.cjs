module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['svelte3', '@typescript-eslint', 'import'],
  rules: {
    'no-extra-semi': 'error',
    'block-spacing': 'error',
    'no-console': 'error',
    'no-alert': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-var-requires': 'error',
    'import/order': [
      'error',
      {
        groups: ['external', 'internal', 'builtin', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '(svelte|svelte/**)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@siam/**',
            group: 'internal',
          },
          {
            pattern: '$lib/**',
            group: 'builtin',
          },
          {
            pattern: '$locale',
            group: 'builtin',
          },
        ],
        pathGroupsExcludedImportTypes: ['@siam/**', '($lib/**|$locale)'],
        distinctGroup: false,
      },
    ],
  },
  ignorePatterns: ['*.cjs'],
  overrides: [
    { files: ['*.svelte'], processor: 'svelte3/svelte3' },
    {
      files: ['*.stories.svelte'],
      rules: {
        'no-console': 'warn',
        'no-alert': 'warn',
      },
    },
  ],
  settings: {
    'svelte3/typescript': true,
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
};
