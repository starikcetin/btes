/* eslint-disable @typescript-eslint/no-var-requires */

const name = require('./package.json').name;

module.exports = {
  name,
  displayName: name,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
