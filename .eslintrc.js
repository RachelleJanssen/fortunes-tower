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
    'max-len': 'off',
    'no-console': 'warn',
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
  },
};
