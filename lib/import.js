var _ = require('underscore');

function Importer(api, opts) {

  this.api     = api;
  this.opts    = opts
  var importer = this;

  this.getImporter = function(type) {
    var i = importer.importers.hasOwnProperty(type) ? new importer.importers[type] : undefined;
    return i;
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
