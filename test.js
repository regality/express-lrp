var express = require('express')
  , http    = require('http')
  , lrp     = require('./index')
  , app     = express()
  ;

lrp(app);

app.use(app.router);

app.get('/', function(req, res) {
  res.end('hello world');
});

app.lrp('lrp', function(done, progress) {
  var count = 0;
  var max = 8;
  var stop = setInterval(function() {
    count++;
    progress(count/max);
    if (count === max) {
      clearInterval(stop);
      done(null, count);
    }
  }, 5000);
});

http.Server(app).listen(8080, function() {
  console.log('listening on port 8080');
});
