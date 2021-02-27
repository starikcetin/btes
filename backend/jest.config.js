const name = 'backend';

module.exports = {
  name,
  displayName: name,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/__gen/',
    '<rootDir>/src/common/',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__gen/**',
    '!src/common/**',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
