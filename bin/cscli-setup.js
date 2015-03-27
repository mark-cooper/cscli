#!/usr/bin/env node

var config = require('../lib/config.js');
var prompt = require('prompt');

exports.command = {
  description: "save collectionspace details to ~/.cscli"
}

if (require.main === module) {
  prompt.get([{
    description: 'CollectionSpace URL',
    name: 'backend_url',
    pattern: /^(https?|\d{4})/,
    type: 'string',
    required: true,
  default: 'http://localhost:8180',
  }, {
    name: 'user',
    description: 'Your username',
    type: 'string',
    required: true,
  default: 'admin@core.collectionspace.org',
  }, {
    name: 'password',
    description: 'Your password',
    type: 'string',
    required: true,
    hidden: true
  }], function(err, result) {
    config.backend_url = result.backend_url + '/cspace-services';
    config.username    = result.user;
    config.password    = result.password;
    config.save();
  });
}
