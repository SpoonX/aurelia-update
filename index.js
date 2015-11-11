var dependencies    = require(process.cwd() + '/package.json').jspm.dependencies,
    dependencyNames = Object.getOwnPropertyNames(dependencies),
    jspm            = require('jspm/api');

function installNextDependency () {
  if (!dependencyNames || 0 === dependencyNames.length) {
    return console.log('> Finished.');
  }

  var dependencyName     = dependencyNames.pop(),
      depencyInstallPath = dependencies[dependencyName].split('@')[0];

  if (!dependencyName.match(/(^aurelia\-|.*?\/aurelia\-.*?$)/)) {
    return installNextDependency();
  }

  notifyOnProgress(dependencyName);

  jspm.install(dependencyName, depencyInstallPath, {parent: true})
    .then(function () {
      notifyOnProgress(dependencyName, true);
      installNextDependency();
    })
    .catch(function (error) {
      console.log(error);
      notifyOnProgress(dependencyName, error.toString());
      installNextDependency();
    });
}

function notifyOnProgress (dependency, success) {
  var message = '- ' + dependency + ': ';

  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  if (typeof success === 'undefined') {
    message += 'Installing...';
  } else if (true === success) {
    message += 'Success!';
  } else {
    message += 'Failed! Message: ' + success.toString();
  }
  process.stdout.write(message);

  if (true === success) {
    process.stdout.write('\n');
  }
}

console.log('> Starting update.');

module.exports = installNextDependency;
