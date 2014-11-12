var async       = require("async");
//var compare     = require("compare");
var logger      = require("./lib/logger").logger;
var run         = require("./lib/_run")(logger);

var config = {
    base: "http://selco.static:8000",
    outDir: "screenshots",
    cwd: "/Users/shakyshane/code/selco-static",
    tests: [
        {
            hash: "3b358a56e2ede7927cf"
        },
        {
            hash: "e1e418dfa7c7e9640b"
        }
    ],
    paths: [
        "/buy/homepage.php"
    ]
}

logger.info("Working in: {yellow:%s", config.cwd);
config.paths.forEach(function (path) {
    logger.debug("Adding {yellow:%s} to the queue", config.cwd);
});

async.eachSeries(config.tests, function (item, cb) {
    process.env["WDIFU_HASH"]    = item.hash;
    process.env["WDIFU_BASE"]    = config.base;
    process.env["WDIFU_PATHS"]   = config.paths.join(",");
    process.env["WDIFU_OUT_DIR"] = config.outDir;

    run(item, config, function (err, out) {
        if (err) {
            return cb(err);
            if (out) {
                console.log(out);
            }
        }
        cb();
    });
}, function (err) {
    if (err) {
        console.log(err.message);
        logger.error("Tests failed");
        process.exit(1);
    }
    process.exit(0);
});

