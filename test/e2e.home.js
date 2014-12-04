/**
 *
 */
// abstract writing screen shot to a file
var path = require('path');
var _    = require('lodash');
var fs   = require('fs-extra');

function writeScreenShot(data, dir, filename) {
    fs.ensureDirSync(dir);
    var fileout = path.join(dir, filename);
    var stream = fs.createWriteStream(fileout);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
    return fileout;
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
            screengrabOnePage(flow, {
                increment: increment,
                hash: hash,
                url: url,
                outDir: outDir
            });
        });
        flow.execute(function () {
            fs.writeJsonFileSync("./json.json", {name: "shane"});
        })
    });
});

function getFilename (url, i) {
    return path.basename(url).replace(path.extname(url), "") + "-" + i + ".png";
}

function screengrabOnePage(flow, opts, state) {

    var ptor = protractor.getInstance();

    // Get document height from browser
    return ptor.executeScript('return document.body.clientHeight').then(function (height) {

        // Get amount of screens needed
        var count = Math.ceil(height/opts.increment);
        var tasks = [];

        var n      = Math.ceil(height / opts.increment);
        var rem    = height % opts.increment;
        var jobs   = [];

        for (var i = 0; i < n; i += 1) {
            jobs.push({
                "height": (i === n - 1) ? rem : opts.increment,
                "scroll": i * opts.increment
            });
        }

        var outfiles = _.cloneDeep(opts);
        outfiles.images = [];

        // push tasks onto the web driver stack
        Object.keys(jobs).forEach(function (key, i) {
            flow.execute(function () {
                var info = getScreenFileInfo(i, jobs[key].scroll, opts);
                outfiles.images.push(info);
                doScreenGrab(i, jobs[key], opts.increment, info);
            }).then(function (out) {
                var imgjson = path.join(opts.outDir, opts.hash.slice(0, 8) + "-images.json");
                fs.writeJsonFileSync(imgjson, outfiles);
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

/**

 1 - scroll: 0,    height: 500
 1 - scroll: 500,  height: 500
 1 - scroll: 1000, height: 450

 */

function doScreenGrab (i, item, increment, fileOpts) {
    var ptor = protractor.getInstance();
    var scrollpos = item.scroll;

    if (item.height < increment) {
        scrollpos = scrollpos - increment;
        browser.manage().window().setSize(320, item.height + 108);
    }

    return ptor.executeScript('window.scrollTo(0,'+(scrollpos)+');').then(function (out) {
        ptor.executeScript('return window.scrollY').then(function (out) {});
        return browser.takeScreenshot();
    }).then(function (png) {
        return writeScreenShot(png, fileOpts.dir, fileOpts.filename);
    });
}