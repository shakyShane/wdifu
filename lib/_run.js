var exec        = require("child_process").exec;
var path        = require("path");
var configFile  = path.resolve(__dirname + "/../test/config.js");

module.exports = function (logger) {

    return function (test, config, cb) {

        var out = "";
        logger.info("Checking out: {yellow:%s", test.hash.slice(0, 6));
        exec("git checkout " + test.hash, {cwd: config.cwd}, function (err, stdout) {
            if (err) {
                cb(err);
                process.exit(1);
            }
            out += stdout
        }).on("close", function (code) {
            if (code !== 0) {
                cb(err);
                process.exit(1);
            } else {
                logger.debug("Checked out: {yellow:%s", test.hash.slice(0, 6));
                if (test.before) {
                    test.before(function () {
                        runTests(test, config, logger, cb);
                    });
                } else {
                    runTests(test, config, logger, cb);
                }
            }
        });
    }
};

function runTests (test, config, logger, cb) {
    var out = "";
    exec("protractor " + configFile, function (err, stdout) {
        console.log(stdout);
        if (err) {
            doCallback({
                code: 1,
                message: "Did you start webdriver?"
            });
            process.exit(1);
        }
        out += stdout;
    }).on("close", function (code) {
        if (code !== 0) {
            doCallback({
                code: code,
                message: "Protractor tests failed, Details below"
            }, out);
        } else {
            doCallback(null, out);
        }
    });

    function doCallback(err, out) {
        if (test.after) {
            test.after(function () {
                cb(err, out);
            });
        } else {
            cb(err, out);
        }
    }
}