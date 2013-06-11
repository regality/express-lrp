var events  = require('events')
  , uuid    = require('uuid')
  , running = {}
  ;

module.exports = setup;

function setup(app) {
  app.lrp = lrp;
  return app;
}

function lrp(name, fn) {

  var app = this;

  function startProcess(req, res) {
    var id = uuid.v4();
    var emitter = new events.EventEmitter;
    emitter.id = id;
    running[id] = emitter;

    fn(req, function(err, data) {
      emitter.done = true;
      emitter.err = err;
      emitter.data = data;
      emitter.emit('done', err, data);
    }, function(p) {
      emitter.emit('progress', p);
    });

    emitter.on('cleanup', function() {
      delete running[id];
    });

    return emitter;
  }

  app.get('/lrp/start/' + name, function(req, res, next) {
    var lrp = startProcess(req, res);
    res.json({ id: lrp.id });
  });

  app.post('/lrp/start/' + name, function(req, res, next) {
    var lrp = startProcess(req, res);
    res.json({ id: lrp.id });
  });

  app.get('/lrp/poll/:id', function(req, res, next) {
    var lrp = running[req.params.id];

    if (!lrp) {
      return res.json({
        error: 'no such id'
      });
    }

    if (lrp.done) {
      lrp.emit('cleanup');
      return res.json({
        error: lrp.err ? lrp.err.stack : null,
        data: lrp.data
      });
    }

    lrp.on('done', onDone);
    lrp.on('progress', onProgress);

    var stop = setTimeout(function() {
      res.json({});
      done();
    }, 10e3);

    function onDone(err, data) {
      res.json({
        error: err ? err.stack : null,
        data: data
      });
      done();
    }

    function onProgress(p) {
      res.json({ progress: p });
      done();
    }

    function done() {
      clearTimeout(stop);
      lrp.removeListener('done', onDone);
      lrp.removeListener('progress', onProgress);
    }

  });
}
