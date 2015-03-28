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

  if(!exists) {
    console.log("Input directory does not exist");
    process.exit(1);
  }

  if(typeof importer === "undefined") {
    console.log("Invalid importer type specified");
    process.exit(1);
  }

  if(argv['help']) {
    console.log(importer.help());
    process.exit(0);
  }

  if(!importer.valid()) {
    console.log("Importer options are invalid");
    console.log(importer.help());
    process.exit(1);
  }

  console.log( importer.import() );
}
