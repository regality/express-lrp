(function(window) {

  var defaults = {
    host: '',
    progress: function(){},
    ajax: {
      dataType: 'json',
      type: 'GET'
    }
  };

  function start(options) {
    if (!options.done) throw new Error('lrp done callback is required');
    if (!options.name) return options.done(new Error('lrp name is required'));
    merge(options, defaults);
    options.host = options.host || '';
    var request = {
      url: options.host + '/lrp/start/' + options.name,
      data: options.data || {},
      success: function(data) {
        options.id = data.id;
        poll(options);
      }
    };
    merge(request, defaults.ajax);
    $.ajax(request);
  }

  function poll(options) {
    $.ajax({
      url: options.host + '/lrp/poll/' + options.id,
      dataType: options.dataType || 'json',
      success: function(data) {
        if (data.error) return options.done(new Error(data.error));
        if (data.data) return options.done(null, data.data);
        if (data.progress && options.progress) {
          options.progress(data.progress);
        }
        poll(options);
      }
    });
  }

  function merge(into, from) {
    for (var i in from) {
      if (!into[i]) {
        into[i] = from[i];
      }
    }
  }

  function setDefaults(options) {
    for (var i in options) {
      defaults[i] = options[i];
    }
  }

  window.lrp = start;
  window.lrp.defaults = setDefaults;
  console.log(window.lrp);

})(this);
