// jest-expo preset: Hermes-compatible transforms for RN, Expo and TS. Tests
// cover the pure modules (lib/, stores/, models/) — screens are verified on
// device (CLAUDE.md).
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFiles: ['./jest.setup.js'],
};
