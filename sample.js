var getContentFromURL = require('./sample-helper.js').getContentFromURL;

getContentFromURL("http://www.w3.org/MarkUp/Guide/").
  succeeds(function (content) {
    console.log('Content: ');
    console.log(content);
  }).
  fails(function (err) {
    console.log('Error: ');
    console.log(err);
  });

