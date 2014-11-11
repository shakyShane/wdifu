var async       = require("async");

var logger      = require("eazy-logger").Logger({
    prefix: "{magenta:[WDIFU] ",
    useLevelPrefixes: true,
    custom: {
        "i": function (string) {
            return this.compile("{cyan:" + string + "}");
        }
    }
});

var run         = require("./run")(logger);

var tests       = [
    {
        hash: "3b358a56e2ede7927cf"
    },
    {
        hash: "e1e418dfa7c7e9640bce6779310e795eefbe1ca3"
    }
];

var config = {
    base: "http://selco.static:8000",
    cwd: "/Users/shakyshane/code/selco-static"
}

async.eachSeries(tests, function (item, cb) {

    logger.info("Working in: {yellow:%s", config.cwd);

    logger.info("Running against: {yellow:%s", item.hash.slice(0, 5));

    process.env["WDIFU_HASH"] = item.hash;
    process.env["WDIFU_BASE"] = config.base;

    run(item, config, function (err, out) {

        if (out) {
            console.log(out);
        }
        if (err) {
            return cb(err);
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

