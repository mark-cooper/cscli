var fs     = require('fs');
var glob   = require('glob');
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
      if (err) return;
      files.forEach(function(f) {
        fs.readFile(f, function(err, data) {
          if (err) return;
          parser.parseString(data, function (err, result) {
            return callback(result);
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

    this.import = function() {
      return "collectionobject";
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

    this.import = function() {
      var shortid = importer.opts['shortid'];
      return 'person';
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

    this.import = function() {
      // var dir = importer.opts['dir'];
      importer.run(function(xml) {
        console.log(xml);
      });
      return 'personauthority';
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
