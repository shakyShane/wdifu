var crossbow = require("/Users/shakyshane/code/crossbow.js/index.js");
var report   = require("./screenshots/report.json");
var fs = require("fs");
crossbow.addPage("index.html", '{{inc src="templates/index.html" }}')

var config = {
    siteConfig: {
        title: "Selco CSS report",
        width: "320px"
    },
    report: report
}

crossbow.compileOne("index.html", config, function (err, out) {
    fs.writeFileSync("./screenshots/report.html", out.compiled, "utf-8");
});