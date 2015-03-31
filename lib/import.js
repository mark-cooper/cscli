var fs     = require('fs');
var glob   = require('glob');
var queue  = require('queue-async');
var xml2js = require('xml2js');
var _      = require('underscore');
var util   = require('util');
var parser = new xml2js.Parser();

function Importer(api, opts) {

  this.api     = api;
  this.opts    = opts;
  var importer = this;

  // extract csid from location header
  this.getCsid = function(location) {
    return location.split("/").slice(-1)[0];
  };

  // return importer specified on command line
  this.getImporter = function(type) {
    var m = "cscli error: invalid importer type specified --type=" + type;
    var i = importer.importers.hasOwnProperty(type) ? new importer.importers[type] : importer.help(m);
    return i;
  };

  // print help and exit
  this.help = function(message) {
    console.log(message);
    process.exit(1);
  }

  // return each file read as xml in input directory to callback for processing
  this.run = function(callback) {
    var dir    = importer.opts['dir'];
    var exists = fs.existsSync(dir);
    if(!exists) importer.help("cscli error: input directory does not exist --dir=" + dir);
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
      console.log('cscli import --type collectionobject --dir <directory>');
      process.exit(1);
    };

    this.import = function(queue) {
      queue.defer(function(callback) {
        return callback(null, "collectionobject");
      });
    };

    this.validate = function() {
      return true;
    }

    return self;
  }

  this.person = function() {
    var self = this;

    this.help = function() {
      console.log('cscli import --type person --shortid <shortid> --dir <directory>');
      process.exit(1);
    };

    this.import = function(queue) {
      var shortid = importer.opts['shortid'];
      importer.run(function(err, xml) {
        queue.defer(function(callback) {
          importer.api.getPersonAuthorityById(shortid, function(err, res, data) {
            var csid = data['ns2:personauthorities_common'][0]['csid'][0];
            importer.api.createPerson(csid, xml, function(err, res, data) {
              var id = importer.getCsid(res['headers']['location']);
              return callback(err, id);
            });
          });
        });
      });
    };

    this.validate = function() {
      return util.isNullOrUndefined(importer.opts['shortid']) ? false : true;
    }

    return self;
  }

  this.personauthority = function() {
    var self = this;

    this.help = function() {
      console.log('cscli import --type personauthority --dir <directory>');
      process.exit(1);
    };

    this.import = function(queue) {
      importer.run(function(err, xml) {
        queue.defer(function(callback) {
          importer.api.createPersonAuthority(xml, function(err, res, data) {
            var id = importer.getCsid(res['headers']['location']);
            return callback(err, id);
          });
        });
      });
    };

    this.validate = function() {
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
