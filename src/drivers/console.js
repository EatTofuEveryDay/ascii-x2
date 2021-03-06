"use strict";
// File summary
// cmdline.ts: A driver for node.js
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter_1 = require("../eventemitter");
const linebr = "\n";
class ConsoleDriver extends eventemitter_1.EventEmitter {
    constructor() {
        super();
        // Setup stdin for TTY use
        if (!process.stdout.isTTY) {
            throw new Error("Must be run in TTY mode.");
        }
        process.stdin.setRawMode(true);
        process.stdin.setEncoding("utf-8");
        process.stdin.resume();
        process.stdin.on("data", function (key) {
            // simulate Ctrl-C to exit
            if (key === "\u0003")
                process.exit(0);
            else
                this.emit("key", key);
        }.bind(this));
        this.stdout = process.stdout;
        this.stdout.cursorTo(0, 0);
        this.stdout.clearScreenDown();
        // Create detailed platform key
        this.detailedPlatform = "node:" + process.version;
        var versionKeys = Object.keys(process.versions);
        for (var i = 0; i < versionKeys.length; i++) {
            var thisKey = versionKeys[i];
            if (thisKey === "node")
                continue;
            this.detailedPlatform += " " + thisKey + ":" + process.versions[thisKey];
        }
    }
    initWindow(width, height) { }
    title(str = null) {
        if (str) {
            process.title = str;
            process.stdout.write(`\x1b]2;${str}\x07`);
        }
        return process.title;
    }
    setLine(line, content) {
        this.stdout.cursorTo(0, line);
        this.stdout.write(content);
    }
    makeColor(r, g, b) {
        return r + ";" + g + ";" + b;
    }
    colorDepth() { return this.stdout.getColorDepth(); }
    getText(fcol, bcol, bold) {
        var boldtext = bold ? "\x1b[1m" : "";
        var fstr = (fcol === "initial") ? "" : `\x1b[38;2;${fcol}m`;
        var bstr = (bcol === "initial") ? "" : `\x1b[48;2;${bcol}m`;
        return boldtext + fstr + bstr;
    }
    getClosing() {
        return "\x1b[0m";
    }
    platform() {
        return "node cli";
    }
    detailedPlatformString() {
        return this.detailedPlatform;
    }
    eventNames() {
        return ["key"];
    }
    // Override
    on(ev, cb) { return super.on(ev, cb); }
}
var driver = new ConsoleDriver();
exports.driver = driver;
//# sourceMappingURL=console.js.map