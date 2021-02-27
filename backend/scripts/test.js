/* eslint-disable */

process.env.NODE_ENV = 'test';

process.on('unhandledRejection', (err) => {
  throw err;
});

require('dotenv').config();

const jest = require('jest');
const argv = process.argv.slice(2);

jest.run(argv);
