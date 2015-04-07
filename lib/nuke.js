var fs     = require('fs');
var lazy   = require('lazy');
var queue  = require('queue-async');
var util   = require('util');

function Nuke(opts) {
  // merge opts
  this.opts    = opts;
  this.api     = this.opts.api;
  this.file    = this.opts.file;
  this.queue   = this.opts.queue;
  var nuke     = this;

  this.fire = function() {
    new lazy(fs.createReadStream(nuke.file))
      .lines
      .forEach(function(path) {
        if (typeof path != 'undefined') { // skip blanks
          nuke.queue.defer(function(callback) {
            nuke.api.deleteByPath(path, function(err, res) {
              if(err) return callback(err, "");
              return callback(null, path);
            });
          });
        }
      }
    );
  };

  return nuke;
}

module.exports = Nuke;
