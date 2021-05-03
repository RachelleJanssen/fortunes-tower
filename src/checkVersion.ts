import check from 'check-node-version';

export default function checkVersion(): void {
  check(
    { node: '>= 12' },
    (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      if (result.isSatisfied) {
        console.log('All is well.');
        return;
      }

      console.error('Some package version(s) failed!');

      Object.keys(result.versions).forEach((packageName) => {
        if (!result.versions[packageName].isSatisfied) {
          console.error(`Missing ${packageName}.`);
        }
      });
    },
  );
}
