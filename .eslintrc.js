module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: '2018'
  },
  env: {
    node: true,
    jest: true,
    browser: true
  },
  extends: ['standard', 'standard-jsdoc'],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-new': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-param-description': 0
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
