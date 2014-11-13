var reporter = require("./reporters/html/html.js");
var dummy    = require("./reporters/html/report.json");

reporter(dummy.opts, dummy.images, {error: function() {}});