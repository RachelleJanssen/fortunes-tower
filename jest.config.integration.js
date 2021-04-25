const rootConfig = require('./jest.config.js');

// use the following variable(s) to quickly access a single test, which is faster and more convenient than disabling existing test
// use these two for all unit tests
// make sure the testRegex and coverageFrom are always reset to allFiles before pushing!!!
const allFilesRegex = '/tests/integration.*\\.(test|spec)?\\.(ts|tsx)$';
const allFilesCoverage = [
  './src/controllers/**/*.ts',
  // './src/routers/**/*.ts',
  // './src/middlewares/**/*.ts',
  // './src/lib/**/*.ts',
  // './src/services/**/*.ts',
];

const singleFileName = 'tag';
// use these for a single file (change the name above)
const singleFileRegex = `/${singleFileName}.router.spec.ts`;
const singleFileCoverage = [`./src/controllers/${singleFileName}.*.ts`];

module.exports = {
  ...rootConfig,
  testRegex: allFilesRegex,
  collectCoverageFrom: allFilesCoverage,
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: '<rootDir>/tests/coverage/integration/html/report.html',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/tests/coverage/integration/istanbul',
};
