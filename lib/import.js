var fs     = require('fs');
var glob   = require('glob');
var queue  = require('queue-async');
var xml2js = require('xml2js');
var _      = require('underscore');
var parser = new xml2js.Parser();

function Importer(api, opts) {

  this.api     = api;
  this.opts    = opts
  var importer = this;

  // return importer specified on command line
  this.getImporter = function(type) {
    var i = importer.importers.hasOwnProperty(type) ? new importer.importers[type] : undefined;
    return i;
  };

  // return each file read as xml in input directory to callback for processing
  this.run = function(callback) {
    var dir = importer.opts['dir'];
    glob(dir + "/*.xml", {}, function (err, files) {
      if (err) return callback(err, {});
      files.forEach(function(f) {
        fs.readFile(f, function(err, data) {
          if (err) return callback(err, {});
          parser.parseString(data, function (err, result) {
            return callback(err, result);
          });
        });
      });
    });
  };

  this.collectionobject = function() {
    var self = this;

    this.help = function() {
      return 'cscli import --type collectionobject --dir <directory>';
    };

    this.import = function(queue) {
      queue.defer(function(callback) {
        return callback(null, "collectionobject");
      });
    };

    this.valid = function() {
      // check opts
      return true;
    }

    return self;
  }

  this.person = function() {
    var self = this;

    this.help = function() {
      return 'cscli import --type person --shortid <shortid> --dir <directory>';
    };

    this.import = function(queue) {
      var shortid = importer.opts['shortid'];
      queue.defer(function(callback) {
        return callback(null, "person");
      });
    };

    this.valid = function() {
      // check opts
      return true;
    }

    return self;
  }

  this.personauthority = function() {
    var self = this;

    this.help = function() {
      return 'cscli import --type personauthority --dir <directory>';
    };

    this.import = function(queue) {
      importer.run(function(err, xml) {
        queue.defer(function(callback) {
          importer.api.createPersonAuthority(xml, function(err, res, data) {
            var id = res['headers']['location'].split("/").slice(-1)[0];
            return callback(err, id);
          });
        });
      });
    };

    this.valid = function() {
      // check opts
      return true;
    }

    return self;
  }

  importer.importers = {
    'collectionobject': importer.collectionobject,
    'person': importer.person,
    'personauthority': importer.personauthority
  }

  return importer;
}

module.exports = Importer;
