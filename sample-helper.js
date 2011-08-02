var http = require('http'),
    Deferred = require('./index.js').Deferred,
    when = require('./index.js').when,
    url = require('url');

function getContentFromURL(sUrl, timeout)
{
  var urlParts = url.parse(sUrl),
      host = urlParts['hostname'],
      path = urlParts['pathname'];
  
  var options = {
    host: host,
    port: 80,
    path: path
  };

  var deferred = new Deferred(),
      body = '',
      timeout = timeout || 500,
      timer = null;
  
  timer = setTimeout(function () {
    deferred.reject('Connection timed out');
  }, timeout);

  http.get(options, function(res) {
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function() {
      deferred.resolve(body);
      clearTimeout(timer);
    });
  }).on('error', function(e) {
    deferred.reject(e);
    clearTimeout(timer);
  });

  return when(deferred);
}

exports.getContentFromURL = getContentFromURL
