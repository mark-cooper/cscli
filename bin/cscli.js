#!/usr/bin/env node

var fs   = require('fs');
var path = require('path');
var root = path.join(path.dirname(fs.realpathSync(__filename)), '../');
require(path.join(root, "index.js"));
