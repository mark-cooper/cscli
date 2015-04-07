#!/usr/bin/env node

var fs    = require('fs');
var queue = require('queue-async');
var util  = require('util');

var config = require('../lib/config');
var nuke   = require('../lib/nuke');

var csapi = require('csapi');
var csapi = new csapi(config);

exports.command = {
  description: "nuke records in collectionspace!"
}

// prompt to confirm
if (require.main === module) {
  var argv   = require('minimist')(process.argv.slice(2));
  var q      = queue(1);
  var table  = require('cli-table');

  var file   = argv['file'];
  var exists = fs.existsSync(file);

  if(argv['help'] || !exists) {
    console.log("cscli nuke --file=<file>");
    process.exit(1);
  }

  var opts = {
    api: csapi,
    file: file,
    queue: q
  };

  var nuke = new nuke(opts).fire();
  q.awaitAll(function(error, results) {
    results.forEach(function(result) {
      console.log("Deleted: " + result);
    });
  });
}