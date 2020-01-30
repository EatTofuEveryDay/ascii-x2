"use strict";
// File summary
// buffer.ts: Colored and Uncolored buffers for graphics in ASCII art
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("./colors");
exports.Color = colors_1.Color;
exports.colors = colors_1.colors;
const importdriver_1 = require("./importdriver");
var flags = {
// vsync was removed... It's no longer practical to implement
};
// ASCIIBuffer (and its colored brother) now supports scrolling
// They will still work as normal if not provided maxHeight
// param at constructor, if no param then
// maxHeight === height
// Represents a buffer for ascii art
class ASCIIBuffer {
    // Assumes that the driver is already initialized to the correct dimensions
    constructor(nw, nh, maxHeight = nh) {
        // Scrolling
        this.scrollTop = 0;
        this.width = nw;
        this.height = nh;
        this.maxHeight = maxHeight;
        this.invalidRows = new Set();
        this.clear();
    }
    // Clears (and renders) the buffer
    clear() {
        this.buf = [];
        for (var i = 0; i < this.height; i++) {
            this.buf.push(" ".repeat(this.width));
        }
        this.render(true);
    }
    // Drawing methods
    rect(x, y, width, height, empty = false) {
        for (var j = 0; j < height; j++) {
            var mstr = this.buf[j + y].substr(0, x);
            for (var i = 0; i < width; i++) {
                if ((i === 0 || i === width - 1) && (j === 0 || j === height - 1)) {
                    mstr += "+";
                }
                else if (i === 0 || i === width - 1) {
                    mstr += "|";
                }
                else if (j === 0 || j === height - 1) {
                    mstr += "-";
                }
                else if (empty) {
                    mstr += " ";
                }
                else {
                    mstr += this.buf[j + y].charAt(i + x);
                }
            }
            this.buf[j + y] = mstr + this.buf[j + y].substr(x + width);
            this.invalidRows.add(j + y);
        }
    }
    text(txt, x, y) {
        this.invalidRows.add(y);
        var mstr = this.buf[y].substr(0, x);
        mstr += txt;
        mstr += this.buf[y].substr(txt.length + x);
        this.buf[y] = mstr;
    }
    // A print-viewable text array
    image(img, x, y) {
        for (var i = 0; i < img.length; i++) {
            // Text updates invalidRows
            this.text(img[i], x, y + i);
        }
    }
    fill(char, sx, sy, ex, ey) {
        for (var i = 0; i < ey - sy; i++) {
            // Text updates invalidRows
            this.text(char.charAt(0).repeat(ex - sx), sx, sy + i);
        }
    }
    scroll(x) {
        this.scrollTop += x;
    }
    scrollTo(x) {
        this.scrollTop = x;
    }
    invalidateRow(x) {
        this.invalidRows.add(x);
    }
    render(ignoreCache = false) {
        for (var i = 0; i < this.height; i++) {
            if (!ignoreCache && !this.invalidRows.has(i + this.scrollTop)) {
                break;
            }
            importdriver_1.driver.setLine(i, this.buf[i + this.scrollTop]);
        }
    }
}
exports.ASCIIBuffer = ASCIIBuffer;
;
// ASCIIBuffer but has color
class ColoredASCIIBuffer extends ASCIIBuffer {
    constructor(nw, nh, maxHeight = nh) {
        super(nw, nh, maxHeight);
        this.spancache = [];
        for (var i = 0; i < nh; i++) {
            this.spancache.push([]);
        }
    }
    clear() {
        this.clear_col();
        super.clear();
    }
    clear_col(line) {
        if (line === undefined) {
            this.spancache = [];
            for (var i = 0; i < this.height; i++) {
                this.spancache.push([]);
            }
        }
        else {
            this.spancache[line] = [];
        }
    }
    color(line, from, to, fcol, bcol, bold = false) {
        var cspan = new colors_1.ColoredSpan();
        cspan.fgcol = fcol;
        cspan.bgcol = bcol;
        cspan.bold = bold;
        cspan.from = from;
        cspan.to = to;
        this.spancache[line].push(cspan);
        this.invalidRows.add(line);
    }
    useColorJSON(json) {
        for (var i = 0; i < json.length; i++) {
            var el = json[i];
            // color() updates invalidRows
            this.color(el.y, el.xstart, el.xend, el.fg, el.bg);
        }
    }
    render(ignoreCache = false) {
        for (var v = 0; v < this.height; v++) {
            var tv = v + this.scrollTop;
            if (!ignoreCache) {
                if (!this.invalidRows.has(tv)) {
                    break;
                }
            }
            this.spancache[tv].sort((a, b) => (a.from < b.from) ? -1 : (a.from == b.from ? 0 : 1));
            var spanindex = 0;
            var buf = "";
            for (var x = 0; x < this.width; x++) {
                var cspan = this.spancache[tv][spanindex];
                if (cspan) {
                    if (x === cspan.from) {
                        buf += cspan.to_spantext();
                    }
                    if (x === cspan.to) {
                        buf += importdriver_1.driver.getClosing();
                        spanindex++;
                    }
                }
                buf += this.buf[tv].charAt(x);
            }
            importdriver_1.driver.setLine(v, buf);
        }
        this.invalidRows.clear();
    }
}
exports.ColoredASCIIBuffer = ColoredASCIIBuffer;
;
var title = importdriver_1.driver.title;
exports.title = title;
function initializeWindow(width, height) {
    importdriver_1.driver.initWindow(width, height);
}
exports.initializeWindow = initializeWindow;
//# sourceMappingURL=buffer.js.map