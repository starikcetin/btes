const packageNames = require('./package.json').workspaces;
const packageConfigFiles = packageNames.map(name => `<rootDir>/${name}/jest.config.js`);
const getPackageCoveragePaths = name => require(`./${name}/jest.config.js`).collectCoverageFrom;
const coveragePaths = packageNames.map(getPackageCoveragePaths).flat();

module.exports = {
  projects: [...packageConfigFiles],
  collectCoverageFrom: [...coveragePaths]
};
