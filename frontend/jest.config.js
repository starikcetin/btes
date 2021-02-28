/* eslint-disable @typescript-eslint/no-var-requires */

const name = require('./package.json').name;

module.exports = {
  name,
  displayName: name,
  rootDir: '..',
  roots: [`<rootDir>/${name}/src`],
  collectCoverageFrom: [
    `${name}/src/**/*.{js,jsx,ts,tsx}`,
    `!${name}/src/**/*.d.ts`,
  ],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: [`<rootDir>/${name}/src/setupTests.ts`],
  testMatch: [
    `<rootDir>/${name}/src/**/__tests__/**/*.{js,jsx,ts,tsx}`,
    `<rootDir>/${name}/src/**/*.{spec,test}.{js,jsx,ts,tsx}`,
  ],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { cwd: __dirname }],
    '^.+\\.css$': `<rootDir>/${name}/config/jest/cssTransform.js`,
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': `<rootDir>/${name}/config/jest/fileTransform.js`,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  modulePaths: [],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
