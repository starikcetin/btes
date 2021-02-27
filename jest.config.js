const packageNames = require('./package.json').workspaces;
const packageConfigFiles = packageNames.map(name => `<rootDir>/${name}/jest.config.js`);

module.exports = {
  projects: [...packageConfigFiles]
};
