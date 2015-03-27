var helmsman = require('helmsman');

var opts = {
  localDir: __dirname + "/bin",
  prefix: "cscli"
}

var cli = helmsman(opts);

cli.parse();
