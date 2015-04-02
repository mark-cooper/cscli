#!/usr/bin/env node

var fs    = require('fs');
var path  = require('path');
var queue = require('queue-async');
var util  = require('util');

var config   = require('../lib/config');
var importer = require('../lib/import');

var csapi = require('csapi');
var csapi = new csapi(config);

exports.command = {
  description: "batch import records into collectionspace"
}

if (require.main === module) {
  var argv   = require('minimist')(process.argv.slice(2));
  var table  = require('cli-table');

  var dir    = argv['dir'];
  var type   = argv['type'];

  var importer = new importer(csapi, argv).getImporter(type);

  if(argv['help'] || !importer.validate()) {
    console.log(importer.help());
  }

  var q = queue(1);
  importer.import(q);
  q.awaitAll(function(error, results) {
    results.forEach(function(result) {
      console.log("CSID: " + result);
    });
  });
}
