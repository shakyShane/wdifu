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
    return ptor.executeScript('return document.body.clientHeight').then(function (out) {

        // Get amount of screens needed
        var count = Math.ceil(out/opts.increment);
        var tasks = [];

        for (var i = 0, n = count; i < n; i += 1) {
            tasks.push(i * opts.increment);
        }

        var outfiles = _.cloneDeep(opts);
        outfiles.images = [];

        // push tasks onto the web driver stack
        tasks.forEach(function (val, i) {
            flow.execute(function () {
                var info = getScreenFileInfo(i, val, opts);
                outfiles.images.push(info);
                return doScreenGrab(i, val, info);
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


function doScreenGrab (i, inc, fileOpts) {
    var ptor = protractor.getInstance();
    return ptor.executeScript('window.scrollTo(0,'+(inc)+');').then(function (out) {
        ptor.executeScript('return window.scrollY').then(function (out) {});
        return browser.takeScreenshot();
    }).then(function (png) {
        return writeScreenShot(png, fileOpts.dir, fileOpts.filename);
    });
}