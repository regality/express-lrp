var express = require('express')
  , http    = require('http')
  , lrp     = require('../index')
  , app     = lrp(express())
  ;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('index');
});

app.lrp('lrp', function(done, progress) {
  var count = 0;
  var max = 8;
  var stop = setInterval(function() {
    count++;
    progress(Math.round((count/max)*100));
    if (count === max) {
      clearInterval(stop);
      done(null, count);
    }
  }, 1000);
});

http.createServer(app).listen(3000);
console.log("Express server listening on port 3000");
