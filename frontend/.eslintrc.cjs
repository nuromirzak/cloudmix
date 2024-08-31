module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'arrow-body-style': ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'always'],
    'import/no-default-export': 'error',
    'quotes': ['error', 'double', { 'allowTemplateLiterals': true }],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'eol-last': ['error', 'always'],
  },
}
