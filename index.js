var screener = require("./lib/screens");
var merger = require("opt-merger");
var async = require("async");
var comp = require("./lib/compare");
var path = require("path");
var fs = require("fs-extra");
var compare = require("img-compare");
var logger = require("./lib/logger").logger;

var defaults = {
    cwd: process.cwd(),
    outDir: "screenshots"
};

module.exports = function (config, cb) {
    var opts = merger.set({simple: true}).merge(defaults, config);
    opts.logger = logger;
    screener(opts, function (err, out) {
        if (err) {
            throw err;
        }
        doImageComparisons(opts);
    });
};

function doImageComparisons(opts) {
    opts.logger.info("Running image comparisons...");
    var images = getImageData(opts);
    comp(images, opts, function (err, out) {
        if (err) {
            console.log(err.message);
        }
        runReport(opts, out);
    });
}

function runReport(opts, out) {
    fs.writeJsonFileSync("./report.json", out);
}

function getJsonPath(opts, i) {
    return opts.tests.map(function (item) {
         return require(path.resolve(
            path.join(
                opts.outDir, item.hash.slice(0, 8) + "-images.json"
            )
        )).images;
    });
}

function getImageData(opts) {
    try {
        return getJsonPath(opts);
    } catch (e) {
        console.log(e.message);
    }
}
module.exports.getImageData = getImageData;