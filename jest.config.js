// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules/',
    'tests/helpers.js'
  ],
  testMatch: [
    '**/tests/*.js'
  ]
}
