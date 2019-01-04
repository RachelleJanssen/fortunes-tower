import semver from 'semver';

import * as packageJSON from '../package.json';

export default function checkVersion(): void {
  const engines = packageJSON.engines;

  const version = engines.node;
  if (!semver.satisfies(process.version, version)) {
    console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
    process.exit(1);
  }
}
