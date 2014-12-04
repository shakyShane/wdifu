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

function stripBaseDir(outdir, path) {
    return path.replace(outdir + "/", "");
}

module.exports = function (opts, out, logger) {


    //console.log(opts);
    //console.log(out);

    out.forEach(function (item) {

        if (item.report.status === "fail") {
            logger.error("Comparison fail: {yellow:%s} & {yellow:%s} are different.", item.path1, item.path2);
            logger.error("Diff file created: {yellow:%s}", item.report.report.outfile);
        }
        item.path1 = stripBaseDir(opts.outDir, item.path1);
        item.path2 = stripBaseDir(opts.outDir, item.path2);

        if (item.report.status === "failure") {
            item.report.outfile = stripBaseDir(opts.outDir, item.report.outfile);
        }
    });

    config.siteConfig.opts   = opts;
    config.siteConfig.images = out;

    //fs.writeJSONFileSync(__dirname + "/report.json", config.siteConfig);

    crossbow.compileOne("index.html", config, function (err, out) {
        fs.writeFileSync("./screenshots/report.html", out.compiled, "utf-8");
    });

    //fs.writeJsonFileSync(opts.outDir + "/report.json", {
    //    opts: opts,
    //    images: out
    //});
};