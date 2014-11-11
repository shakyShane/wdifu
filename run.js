var exec        = require("child_process").exec;
var path        = require("path");
var configFile  = path.resolve("./test/config.js");

module.exports = function (logger) {

    return function (test, config, cb) {

        var out = "";
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
                if (test.before) {
                    test.before(function () {
                        runTests(test, cb);
                    });
                } else {
                    runTests(test, cb);
                }
            }
        });
    }
};


function runTests (test, cb) {
    var out = "";
    exec("protractor " + configFile, function (err, stdout) {
        if (err) {
            doCallback({
                code: 1,
                message: stdout
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