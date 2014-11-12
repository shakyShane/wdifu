var path        = require("path");
var exec        = require("child_process").exec;
var fs          = require("fs-extra");
var args        = "/usr/local/bin/perceptualdiff";
var hashes      = ["3b358", "e1e41"];
var files       = ["homepage-0.png", "homepage-1.png", "homepage-2.png", "homepage-3.png"];
var dir         = process.cwd() + "/screenshots";
var async       = require("async");
var opts        = "-gamma 2.4";

var tests    = [];
var failures = [];
var success  = [];

files.forEach(function (file, i) {
    tests.push({
        command: [args, makePath(file, dir, hashes), opts, "-output " + makeOutPath(file, dir)].join(" "),
        filename: file,
        file1: path.join(hashes[0], file),
        file2: path.join(hashes[1], file),
        cwd: dir,
        hashes: hashes,
        diffFile: path.join("diffs", file.replace(".png", ".diff.png")),
        index: i
    });
});

function makeOutPath (file, dir) {
    dir = path.join(dir, "diffs");
    fs.ensureDirSync(dir);
    return path.join(dir, file.replace(".png", ".diff.png"));
}

function makePath (file, dir, hashes) {
    return hashes.map(function (hash, i) {
        return [dir, hash, file].join("/");
    }).join(" ");
}

async.eachSeries(tests, function (item, cb) {
    runOne(item, cb);
}, function (err) {
    if (err) {
        console.log(err);
    }
    report(failures, success);
});

function report (failures, success) {
    var out = {
        cwd: dir,
        hashes: hashes,
        failures: failures,
        success: success
    };
    fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify(out, null, 4));
}

/**
 * @param item
 * @param cb
 */
function runOne (item, cb) {
    var out = "";
    exec(item.command, {cwd: __dirname}, function (err, stdout) {
        out += stdout;
    }).on("close", function (code) {
        if (code !== 0) {
            failures.push(item);
        } else {
            success.push(item);
        }
        item.stdout = out;
        item.stats  = getStats(item, out);
        return cb(null, out);
    })
}


function getStats (item, out) {

    var stats = {};

    if (out.length > 0) { // there's stdout
        var split = out.split("\n");
        var matches;
        if (matches = split[1].match(/^(\d)+? /)) {
            stats.pixeldiff = matches[0];
        } else {
            stats.pixeldiff = null;
        }
    }

    return stats;
}