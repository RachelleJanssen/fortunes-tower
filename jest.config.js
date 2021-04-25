module.exports = {
  rootDir: './',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'src'],
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageReporters: ['html', 'lcov'],
  coveragePathIgnorePatterns: [
    './assets',
    './bin',
    './data',
    './src/*.ts',
    './src/models',
    './src/scripts',
    './src/@types',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 80,
      lines: 90,
      statements: -85,
    },
  },
  globalSetup: '<rootDir>/tests/seeders/seederUp.ts',
  globalTeardown: '<rootDir>/tests/seeders/seederDown.ts',
};
