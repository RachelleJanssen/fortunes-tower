/* eslint-disable quote-props */
module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src'],
      },
    },
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'promise',
  ],
  rules: {
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-inferrable-types': 'off',
    'max-len': 'off',
    'no-console': 'warn',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'indent': 'off',
  },
};
