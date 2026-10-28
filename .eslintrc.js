module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: { requireConfigFile: false },
  env: { jest: true },
  rules: { 'react-native/no-inline-styles': 'error' },
  overrides: [
    {
      files: ['scripts/**/*.cjs'],
      env: { node: true },
      parserOptions: { ecmaVersion: 2022, sourceType: 'script' },
    },
  ],
};
