/* eslint-disable @typescript-eslint/no-var-requires */

const name = require('./package.json').name;

module.exports = {
  name,
  displayName: name,
  rootDir: '..',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [`<rootDir>/${name}/src`],
  transformIgnorePatterns: [
    `<rootDir>/${name}/node_modules/`,
    `<rootDir>/${name}/src/__gen/`,
    `<rootDir>/${name}/src/common/`,
  ],
  collectCoverageFrom: [
    `${name}/src/**/*.ts`,
    `!${name}/src/**/*.d.ts`,
    `!${name}/src/__gen/**`,
    `!${name}/src/common/**`,
  ],
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
  setupFilesAfterEnv: [`<rootDir>/${name}/src/setupTests.ts`],
};
