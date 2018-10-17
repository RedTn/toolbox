const R = require('ramda');
const execSync = require('child_process').execSync;

const execSyncToConsole = R.curryN(2, R.flip(execSync))({stdio:[0,1,2]});

R.pipe(
  execSync,
  R.toString,
  R.split('\n'),
  R.when(
    R.any(R.contains('package.json')),
    () => {
      console.log('Change to package.json detected');
      R.tryCatch(
        execSyncToConsole,
        () => {
          console.log('Yarn not detected, falling back to npm');
          execSyncToConsole('npm install');
        }
      )('yarn');
      // Add furthur commands needed here
      // eg. execSyncToConsole('npm build');
    }
  )
)('git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD');

console.log('DONE');
