module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|(?:jest-)?react-native|@react-native(?:-community)?|@react-navigation)/)',
  ],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFiles: ['./jest.setup.js'],
};
