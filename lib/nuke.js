var queue  = require('queue-async');
var util   = require('util');

function Nuke(opts) {
  // merge opts
  this.opts    = opts;
  this.api     = this.opts.api;
  this.paths   = this.opts.paths;
  this.queue   = this.opts.queue;
  var nuke     = this;

  this.fire = function() {
    nuke.paths.forEach(function(path) {
      nuke.queue.defer(function(callback) {
        // pending: nuke.api.deleteByPath ...
        return callback(null, path);
      });
    });
  };

  return nuke;
}

module.exports = Nuke;
