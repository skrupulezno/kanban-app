module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'none',
        tabWidth: 2,
        useTabs: true,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        arrowParens: 'avoid',
        singleAttributePerLine: true,
        printWidth: 80,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
  },
}
