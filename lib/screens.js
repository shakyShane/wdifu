var async       = require("async");
var path        = require("path");

module.exports = function (config, cb) {
    var logger = config.logger;
    var run         = require("./_run")(logger);
    logger.info("Working in: {yellow:%s", config.cwd);
    config.paths.forEach(function (filepath) {
        logger.debug("Adding {yellow:%s} to the queue", filepath);
    });
    async.eachSeries(config.tests, function (item, cb) {
        process.env["WDIFU_HASH"]    = item.hash;
        process.env["WDIFU_BASE"]    = config.base;
        process.env["WDIFU_PATHS"]   = config.paths.join(",");
        process.env["WDIFU_OUT_DIR"] = config.outDir;

        run(item, config, function (err, out) {
            if (err) {
                if (out) {
                    console.log(out);
                }
                return cb(err);
            }
            cb();
        });
    }, function (err) {
        if (err) {
            logger.error(err.message);
            logger.error("Tests failed");
            cb(new Error(err.message));
        }
        var hash1 = config.tests[0].hash.slice(0, 6);
        var hash2 = config.tests[1].hash.slice(0, 6);
        logger.info("Screenshots from {red:%s} saved in: {yellow:%s", hash1, path.join(config.outDir, hash1));
        logger.info("Screenshots from {red:%s} saved in: {yellow:%s", hash2, path.join(config.outDir, hash2));
        cb(null, {
            config: config
        });
    });
}
