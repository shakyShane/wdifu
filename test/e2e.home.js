/**
 *
 */
// abstract writing screen shot to a file
//var fs   = require('fs');
var path = require('path');
var fs = require('fs-extra');

function writeScreenShot(data, dir, filename) {
    fs.ensureDirSync(dir);
    var stream = fs.createWriteStream(path.join(dir, filename));
    stream.write(new Buffer(data, 'base64'));
    stream.end();
    if (!process.env["WDIFU_OUT"]) {
        process.env["WDIFU_OUT"] = filename;
    }  else {
        process.env["WDIFU_OUT"] += filename;
    }
}

function createScreenshotName(filepath) {
    console.log(path.basename(filepath));
    return "screenshots/" + path.basename(filepath) + ".png"
}

function getScreens (height, increment) {
    console.log(Math.ceil(height / increment));
}

describe('Section Navigation', function() {
    var ptor = protractor.getInstance();
    var height, increment, hash, paths, outDir;
    beforeEach(function () {
        increment = 480;
        hash    = process.env["WDIFU_HASH"];
        outDir  = process.env["WDIFU_OUT_DIR"];
        paths   = process.env["WDIFU_PATHS"].split(",");
        browser.ignoreSynchronization = true;
        browser.manage().window().setSize(320, 588);
    });
    it("should contain the BS script element", function () {
        var flow = protractor.promise.controlFlow();
        paths.forEach(function (url) {
            browser.get(url);
            screengrabOnePage({
                increment: increment,
                hash: hash,
                url: url,
                outDir: outDir
            });
        });
        flow.execute(function () {
            process.env["SHANE"] = "awes";
        })
    });
});

function getFilename (url, i) {
    return path.basename(url).replace(path.extname(url), "") + "-" + i + ".png";
}

function screengrabOnePage(opts, state) {

    var ptor = protractor.getInstance();
    var flow = protractor.promise.controlFlow();

    // Get document height from browser
    return ptor.executeScript('return document.body.clientHeight').then(function (out) {

        // Get amount of screens needed
        var count = Math.ceil(out/opts.increment);
        var tasks = [];

        for (var i = 0, n = count; i < n; i += 1) {
            tasks.push(i * opts.increment);
        }

        // push tasks onto the web driver stack
        tasks.forEach(function (val, i) {
            flow.execute(function () {
                getScreenFileInfo(i, val, opts);
                return doScreenGrab(i, val, getScreenFileInfo(i, val, opts));
            });
        });
    });
}

function getScreenFileInfo (i, val, opts) {
    return {
        dir:      path.join(opts.outDir, opts.hash.slice(0, 8)),
        filename: getFilename(opts.url, i+1)
    }
}


function doScreenGrab (i, inc, fileOpts) {
    var ptor = protractor.getInstance();
    return ptor.executeScript('window.scrollTo(0,'+(inc)+');').then(function (out) {
        ptor.executeScript('return window.scrollY').then(function (out) {});
        return browser.takeScreenshot();
    }).then(function (png) {
        return writeScreenShot(png, fileOpts.dir, fileOpts.filename);
    });
}