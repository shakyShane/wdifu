var fs       = require("fs-extra");
var crossbow = require("/Users/shakyshane/code/crossbow.js/index.js");

crossbow.addPage("index.html", fs.readFileSync(__dirname + "/index.hbs", "utf-8"));

var config = {
    cwd: __dirname,
    siteConfig: {
        title: "Selco CSS report",
        width: "320px"
    }
}

module.exports = function (opts, out, logger) {

    out.forEach(function (item) {
        if (item.report.status === "fail") {
            logger.error("Comparison fail: {yellow:%s} & {yellow:%s} are different.", item.path1, item.path2);
            logger.error("Diff file created: {yellow:%s}", item.report.report.outfile);
            item.fail = true;
        } else {
            item.fail = false;
        }
        item.path1 = item.path1.replace(opts.outDir + "/", "");
        item.path2 = item.path2.replace(opts.outDir + "/", "");

        if (item.report.report) {
            item.report.report.outfile = item.report.report.outfile.replace(opts.outDir + "/", "");
        }
    });
    config.siteConfig.opts   = opts;
    config.siteConfig.images = out;
    crossbow.compileOne("index.html", config, function (err, out) {
        fs.writeFileSync("./screenshots/report.html", out.compiled, "utf-8");
    });

    //fs.writeJsonFileSync(opts.outDir + "/report.json", {
    //    opts: opts,
    //    images: out
    //});
};