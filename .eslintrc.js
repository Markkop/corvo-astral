module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: '2018'
  },
  env: {
    node: true,
    jest: true
  },
  extends: 'standard',
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-new': 0
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
}
