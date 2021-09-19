module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  env: {
    node: true,
    jest: true,
    browser: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: ['standard'],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-new': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-param-description': 0,
    '@typescript-eslint/no-var-requires': 0
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ],
  settings: {
    jsdoc: { mode: 'typescript' }
  }
}
