function log(msg) {
  var pre = document.getElementById('log');
  pre.innerHTML = pre.innerHTML + '\n' + msg;
}

log('starting lrp');

lrp({
  name: 'lrp',
  done: function(err, data) {
    if (err) return log('Error: ' + err);
    log('response: ' + data);
    $('#progress-bar')
      .css({ width: '100%', backgroundColor: 'blue', color: 'white' })
      .text('Done!');
  },
  progress: function(progress) {
    console.log($('#progress-bar'));
    $('#progress-bar').css({ width: Math.round(progress) + '%' });
    log('progress: ' + progress + '%');
  }
});
