var comp = require("img-compare");
var async       = require("async");
var path        = require("path");

module.exports = function (images, opts, done) {

    var reports = [];
    var count   = 0;

    async.eachSeries(images[0].images, function (item, cb) {

        var obj   = {};
        var other = images[1].images[count];

        if (!other) {
            return cb();
        }

        obj.path1 = path.join(item.dir,  item.filename);
        obj.path2 = path.join(other.dir, other.filename);

        var ext   = path.basename(item.filename, path.extname(item.filename));

        var config = {
            output:  path.join(opts.outDir, "diffs", ext + ".diff.png")
        };

        comp([obj.path1, obj.path2], config, function (err, out) {
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