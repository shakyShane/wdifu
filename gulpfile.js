var gulp     = require("gulp");
var exec     = require("child_process").exec;
var reporter = require("./reporters/html/html.js");
var dummy    = require("./reporters/html/report.json");
var bs       = require("browser-sync");

gulp.task('browser-sync', function () {
    bs({
        server: {
            baseDir: './screenshots',
            index: 'report.html'
        }
    });
});

gulp.task("default", ['browser-sync'], function () {
    gulp.watch("reporters/html/**", function (path) {
        exec("node reporter", function (err, stdout) {
            if (err) {
                console.log(err.message);
            }
            console.log(stdout);
        }).on("close", bs.reload);
    });
});