# README

Skeleton for Node.js applications written in TypeScript

## pre-start

Install the dependancies using npm
`npm i`

## start

Start the app
`npm run serve`
or
`node ./build/main/index.js`

## start development mode

To start developing you need two steps:

- build and watch for typescript changes (and recompile to the targeted javascript)
- start and watch for javascript changes

In order to do this, run the following two scripts (both in their own terminals):
first terminal:
`npm run watch`
Second terminal:
`npm run serve:watch`

Keep both terminals running while developing

first check if the typescript terminal builds successfully, then check if everything is working as expected in the nodemon

## Other scripts

### build

`npm run build`
"Clean and rebuild the project",

### clean

`npm run clean`
"Clean the build output folders",

### cov

`npm run cov`
"Rebuild, run tests, then create and open the coverage report in HTML",

### cov:check

`npm run cov:check`
"Check the code coverage in the terminal",

### doc

`npm run doc`
"Generate HTML API documentation and open it in a browser",

### doc:json

`npm run doc:json`
"Generate API documentation in typedoc JSON format",

### fix

`npm run fix`
"format files using prettier and try to automatically fix all other linting issues",

### info

`npm run info`
"Display information about the package scripts",

### test

`npm run test`
"Lint and unit test the project",

### test:unit

`npm run test:unit`
"Unit test the project",

### watch

`npm run watch`
"Clean, build and watch for changes. Use this for developing mode"
