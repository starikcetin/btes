/* eslint-disable @typescript-eslint/no-var-requires */

const name = require('./package.json').name;

module.exports = {
  name,
  displayName: name,
  rootDir: '..',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [`<rootDir>/${name}/src`],
  transformIgnorePatterns: [`<rootDir>/${name}/node_modules/`],
  collectCoverageFrom: [`${name}/src/**/*.ts`, `!${name}/src/**/*.d.ts`],
  testMatch: [
    `<rootDir>/${name}/src/**/__tests__/**/*.ts`,
    `<rootDir>/${name}/src/**/*.spec.ts`,
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: `<rootDir>/${name}/tsconfig.json`,
    },
  },
};
