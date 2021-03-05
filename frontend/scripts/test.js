// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
let argv = process.argv.slice(2);

/*
 * There was a code block here for automatically applying `--watch` flag.
 * We will need to run the thing on its own, so I removed it all.
 * Watching tests is not very useful in my opinion, running them once before committing is enough.
 * If we ever need this piece of code back, we can get it from a fresh ejected CRA project.
 * - Tarık, 2021-02-25 17:00
 */

jest.run(argv);
