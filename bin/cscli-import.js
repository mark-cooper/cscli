#!/usr/bin/env node

var fs   = require('fs');
var path = require('path');

var config   = require('../lib/config');
var importer = require('../lib/import');

var api  = {}; // use config for settings

exports.command = {
  description: "Batch import records into collectionspace"
}

if (require.main === module) {
  var argv   = require('minimist')(process.argv.slice(2));
  var table  = require('cli-table');

  var dir    = argv['dir'];
  var exists = fs.existsSync(dir);
  var type   = argv['type'];

  var importer = new importer(api, argv).getImporter(type);

  if (argv.help || !exists || !importer.validate()) {
    console.log(importer.help());
    process.exit(0);
  }

  // loop dir, read files, send to importer
  console.log( importer.import() );
}
