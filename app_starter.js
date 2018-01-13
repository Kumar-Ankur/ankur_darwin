var logger = require('./logger');
var exec = require('child_process').exec;
res = exec("xvfb-run --server-args='-screen 0 1024x768x24' node server.js", function(err, stdout, stderr) {
  if (err) {
      logger
    // should have err.code here?
  }
  console.log(stdout);
});

res.on("exit", function(code) {
  // exit code is code
});
