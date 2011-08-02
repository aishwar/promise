exports.Deferred = Deferred;
exports.when = when;

var slice = Array.prototype.slice;

function when(deferred)
{
  return {
    isPromise: function () {
      return true;
    },
    
    isResolved: function () {
      return deferred.isResolved();
    },
    
    isRejected: function () {
      return deferred.isRejected();
    },
    
    succeeds: function (fn) {
      return when(deferred.succeeds(fn));
    },
    
    fails: function (fn) {
      return when(deferred.fails(fn));
    },
    
    completes: function (fn) {
      return when(deferred.completes(fn));
    }
  };
}

function Deferred()
{
  if (this instanceof Deferred)
  {
    this.successQ = [];
    this.failureQ = [];
    this.completionQ = [];
    this.returnValueArgs = [];
  }
  else
  {
    return new Deferred();
  }
}

Deferred.prototype.resolve = function () {
  if (this.isUnfulfilled())
  {
    var args = slice.call(arguments, 0);
    this.returnValueArgs = args;

    this.successQ.forEach(function (fn) {
      fn.apply(null, args);
    });
    
    this.completionQ.forEach(function (fn) {
      fn.apply(null, args);
    });
    
    if (!this.isResolved())
    {
      this.isResolved = function () { return true; }
    }
  }
}

Deferred.prototype.reject = function () {
  if (this.isUnfulfilled())
  {
    var args = slice.call(arguments, 0);
    this.returnValueArgs = args;
    
    this.failureQ.forEach(function (fn) {
      fn.apply(null, args);
    });
    
    this.completionQ.forEach(function (fn) {
      fn.apply(null, args);
    });
    
    if (!this.isRejected())
    {
      this.isRejected = function () { return true; }
    }
  }
}

Deferred.prototype.isUnfulfilled = function () {
  return !this.isResolved() && !this.isRejected();
}

Deferred.prototype.isResolved = function () {
  return false;
}

Deferred.prototype.isRejected = function () {
  return false;
}

Deferred.prototype.succeeds = function (fn) {
  if (typeof fn == "function")
  {
    if (this.isResolved())
    {
      fn.apply(null, this.returnValueArgs);
    }
    else
    {
      this.successQ.push(fn);
    }
  }
  
  return this;
}

Deferred.prototype.fails = function (fn) {
  if (typeof fn == "function")
  {
    if (this.isRejected())
    {
      fn.apply(null, this.returnValueArgs);
    }
    else
    {
      this.failureQ.push(fn);
    }
  }
  
  return this;
}

Deferred.prototype.completes = function (fn) {
  if (typeof fn == "function")
  {
    if (this.isResolved() || this.isRejected())
    {
      fn.apply(null, this.returnValueArgs);
    }
    else
    {
      this.completionQ.push(fn);
    }
  }
  
  return this;
}

