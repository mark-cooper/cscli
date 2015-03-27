var fs         = require('fs');
var pwuid      = require('pwuid');
var configPath = pwuid().dir + '/.cscli';

var Config = function(opts) {
  this.backend_url = opts.backend_url;
  this.username    = opts.username;
  this.password    = opts.password;

  this.save = function() {
    fs.writeFile(configPath, JSON.stringify(this), function(err) {
      if (err) {
        console.log("Error saving configuration: %s", err);
      } else {
        console.log("Saved config: " + configPath);
      }
    });
  }
}

Config.load = function() {
  var params = {};
  if (fs.existsSync(configPath)) {
    var data = fs.readFileSync(configPath);
    params = JSON.parse(data);
  } else {
    params = {
      backend_url: "http://localhost:8180",
      username: 'admin@core.collectionspace.org',
      password: 'Administator'
    };
  }
  return new Config(params);
}

module.exports = Config.load();