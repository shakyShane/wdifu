var async       = require("async");
var path        = require("path");
var fs          = require("fs");
var fse         = require("fs-extra");
var resemble    = require('node-resemble-js');

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

        resemble.outputSettings({
            errorColor: {
                red: 255,
                green: 0,
                blue: 0
            },
            errorType: 'movement',
            transparency: 0
        });

        resemble(obj.path1).compareTo(obj.path2)
            //.ignoreAntialiasing()
            //.ignoreColors()
            .onComplete(function(data) {
                console.log(data);
                if (data.misMatchPercentage > 1) {
                    fse.ensureDirSync(path.dirname(config.output));
                    data.getDiffImage().pack().pipe(fs.createWriteStream(config.output)).on('close', function () {
                        obj.pass = false;
                        obj.fail = true;
                        obj.report = {
                            status:  "failure",
                            outfile: config.output,
                            report: {
                                isSameDimensions: data.isSameDimensions,
                                dimensionDifference: data.dimensionDifference,
                                misMatchPercentage: data.misMatchPercentage
                            }
                        };
                        reports.push(obj);
                        count += 1;
                        cb();
                    });
                } else {
                    obj.pass = true;
                    obj.fail = false;
                    obj.report = {
                        status:  "pass"
                    };
                    reports.push(obj);
                    count += 1;
                    cb();
                }
            });
    }, function (err) {
        if (err) {
            console.log(err);
        }
        done(null, reports);
    });
};