var comp = require("img-compare");
var async       = require("async");
var path        = require("path");

module.exports = function (images, opts, done) {

    var reports = [];
    var tasks   = [];
    var count   = 0;

    async.eachSeries(images[0], function (item, cb) {

        var obj   = {};
        var other = images[1][count];
        var path1 = path.join(item.dir, item.filename);
        var path2 = path.join(other.dir, other.filename);
        var ext = path.basename(item.filename, path.extname(item.filename));

        obj.path     = path1;

        var config = {
            output:  path.join(opts.outDir, "diffs", ext + ".diff.png"),
            gamma: 2.2
        };

        comp([path1, path2], config, function (err, out) {
            if (err) {
                done(err);
            }
            obj.report = out;
            reports.push(obj);
            cb();
        });
        count += 1;
    }, function (err) {
        if (err) {
            console.log(err);
        }
        done(null, reports);
    });
}