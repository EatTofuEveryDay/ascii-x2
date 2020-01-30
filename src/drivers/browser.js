"use strict";
// File summary
// browser.ts: A driver for "es6 browser"
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter_1 = require("../eventemitter");
var _title = document.querySelector("title");
var _content = document.querySelector("#content");
class BrowserDriver extends eventemitter_1.EventEmitter {
    constructor() {
        super();
        this._lines = [];
        window.addEventListener("keyup", function (ev) {
            this.emit("key", ev.key);
        }.bind(this));
    }
    initWindow(width, height) {
        for (var i = 0; i < height; i++) {
            var el = document.createElement("p");
            this._lines.push(el);
            _content.appendChild(el);
        }
    }
    title(str) {
        if (str) {
            _title.innerHTML = str;
        }
        return _title.innerHTML;
    }
    setLine(line, content) {
        this._lines[line].innerText = content;
    }
    makeColor(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }
    colorDepth() { return screen.colorDepth; }
    ;
    getText(fcol, bcol, bold) {
        var boldexpr = bold ? "bold" : "normal";
        return `<span style="font-weight: ${boldexpr}; color: ${fcol}; background-color: ${bcol};">`;
    }
    getClosing() {
        return "</span>";
    }
    platform() {
        return "es6 browser";
    }
    detailedPlatformString() {
        return navigator.userAgent;
    }
    eventNames() {
        return ["key"];
    }
    // Override
    on(ev, cb) { return super.on(ev, cb); }
}
;
var driver = new BrowserDriver();
exports.driver = driver;
//# sourceMappingURL=browser.js.map