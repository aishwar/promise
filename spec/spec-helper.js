var Deferred = require('../index.js').Deferred;

exports.delayedSuccess = function ()
{
  var deferred = new Deferred();
  setTimeout(function () {
    deferred.resolve();
  }, 100);
  
  return deferred;
}

exports.delayedFailure = function ()
{
  var deferred = new Deferred();
  setTimeout(function () {
    deferred.reject();
  }, 100);
  
  return deferred;
}

exports.deferredSuccessReturningNumbers1to5 = function ()
{
  var deferred = new Deferred();
  setTimeout(function () {
    deferred.resolve(1, 2, 3, 4, 5);
  }, 100);
  
  return deferred;
}

exports.deferredFailureReturningNumbers1to5 = function ()
{
  var deferred = new Deferred();
  setTimeout(function () {
    deferred.reject(1, 2, 3, 4, 5);
  }, 100);
  
  return deferred;
}


