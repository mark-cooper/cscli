#!/usr/bin/env node

var util   = require('util');
var config = require('../lib/config');
var csapi  = require('csapi');
var csapi  = new csapi(config);

exports.command = {
  description: "list records from collectionspace"
}

if (require.main === module) {
  var argv       = require('minimist')(process.argv.slice(2));
  var table      = require('cli-table');
  var format     = argv['format'] || 'table';
  var path       = argv['path'];
  var properties = argv['properties'] || 'uri';
  var size       = argv['size'] || 100;
  var tabular    = format === "table" ? true : false;

  if(argv['help'] || util.isNullOrUndefined(path)) {
    console.log("cscli list --path=<path> [--format=<table> --properties=<properties|uri> --size=<size|100>]");
    process.exit(1);
  }

  var properties = properties.split(",");
  var output = tabular ? new table({ head: properties }) : [];

  csapi.getListByPath('/' + path, { pgSz: 100, wf_deleted: false }, function(err, res, data) {
    if(typeof data['list-item'] === "undefined") {
      console.log('No results found.');
      process.exit(0);
    }

    data['list-item'].forEach(function(item){
      var values = [];
      properties.forEach(function(property) {
        value = item.hasOwnProperty(property) ? item[property][0] : '';
        values.push(value);
      });
      output.push(values);
    });

    // process output
    if(tabular) {
      console.log(output.toString());
    } else {
      output.forEach(function(data) {
        console.log(data.join());
      });
    }
  });
}