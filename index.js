var screener = require("./lib/screens");
var merger = require("opt-merger");
var async = require("async");
var comp = require("./lib/compare");
var path = require("path");
var compare = require("img-compare");
var logger = require("./lib/logger").logger;

var defaults = {
    cwd: process.cwd(),
    outDir: "screenshots"
};

module.exports = function (config, cb) {
    var opts = merger.set({simple: true}).merge(defaults, config);
    screener(opts, logger, function (err, out) {
        if (err) {
            throw err;
        }
        doImageComparisons(opts);
    });
};

function doImageComparisons(opts) {
    logger.info("Running image comparisons...");
    var images = getImageData(opts);
    comp(images, opts, function (err, out) {
        if (err) {
            console.log(err.message);
        }
        runReport(opts, out);
    });
}

function runReport(opts, out) {
    require("./reporters/html/html")(opts, out, logger);
}

function getJsonPath(opts, i) {
    return opts.tests.map(function (item) {
         return require(path.resolve(
            path.join(
                opts.outDir, item.hash.slice(0, 8) + "-images.json"
            )
        ));
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