const rootConfig = require('./jest.config.js');

// use the following variable(s) to quickly access a single test, which is faster and more convenient than disabling existing test
// use these two for all unit tests
// make sure the testRegex and coverageFrom are always reset to allFiles before pushing!!!
const allFilesRegex = '/tests/unittest.*\\.(test|spec)?\\.(ts|tsx)$';
const allFilesCoverage = ['./src/services/**/*.ts'];

const singleFileName = 'group';
// use these variations for a single service test (change the name above)
const singleFileRegex = [
  `/${singleFileName}.service.spec.ts`,
  `/${singleFileName}.baseService.spec.ts`,
  `/${singleFileName}.NLService.spec.ts`,
  `/${singleFileName}.ENService.spec.ts`,
];
const singleFileCoverage = [`./src/**/${singleFileName}.service.ts`];

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
        outputPath: '<rootDir>/tests/coverage/unittest/html/report.html',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/tests/coverage/unittest/istanbul',
};
