const packageNames = ["frontend", "backend", "common"];
const packageConfigFiles = packageNames.map(name => `<rootDir>/${name}/jest.config.js`);

module.exports = {
  projects: [...packageConfigFiles]
};
