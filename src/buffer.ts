// File summary
// buffer.ts: Colored and Uncolored buffers for graphics in ASCII art

import { Color, ColorInJSON, colors, ColoredSpan } from "./colors";
import { driver } from "./importdriver";

// ASCIIBuffer (and its colored brother) now supports scrolling
// They will still work as normal if not provided maxHeight
// param at constructor, if no param then
// maxHeight === height

// Represents a buffer for ascii art
class ASCIIBuffer {
  // Access like buf[y].charAt(x)
  buf: string[];

  // ES6 heck yeah
  invalidRows: Set<number>;
  readonly width: number;
  readonly height: number;
  boundToScreen: boolean;

  // Scrolling
  scrollTop: number = 0;
  readonly maxHeight: number;

  constructor(nw: number, nh: number, maxHeight: number = nh, bindToScreen = true) {
    this.width = nw;
    this.height = nh;
    if (bindToScreen) {
      var needInit = false;
      if (nw > driver.width()) needInit = true;
      if (nh > driver.height()) needInit = true;
      if (needInit) {
        driver.initWindow(nw, nh);
      }
    }
    this.maxHeight = maxHeight;
    this.invalidRows = new Set<number>();
    this.clear();
    this.boundToScreen = bindToScreen;
  }

  // Clears (and renders) the buffer
  clear() {
    this.buf = [];
    for (var i = 0; i < this.maxHeight; i++) {
      this.buf.push(" ".repeat(this.width));
    }
    if(this.boundToScreen)
      this.render(true);
  }

  // Drawing methods
  rect(x: number, y: number, width: number, height: number, empty: boolean = false) {
    for (var j = 0; j < height; j++) {
      var mstr = this.buf[j + y].substr(0, x);
      for (var i = 0; i < width; i++) {
        if ((i === 0 || i === width - 1) && (j === 0 || j === height - 1)) {
          mstr += "+";
        } else if (i === 0 || i === width - 1) {
          mstr += "|";
        } else if (j === 0 || j === height - 1) {
          mstr += "-";
        } else if (empty) {
          mstr += " ";
        } else {
          mstr += this.buf[j + y].charAt(i + x);
        }
      }
      this.buf[j + y] = mstr + this.buf[j + y].substr(x + width);
      this.invalidRows.add(j + y);
    }
  }

  text(txt: string, x: number, y: number) {
    this.invalidRows.add(y);
    var mstr = this.buf[y].substr(0, x);
    mstr += txt;
    mstr += this.buf[y].substr(txt.length + x);
    this.buf[y] = mstr;
  }

  // A print-viewable text array
  image(img: string[], x: number, y: number) {
    for (var i = 0; i < img.length; i++) {
      // Text updates invalidRows
      this.text(img[i], x, y + i);
    }
  }

  fill(char: string, sx: number, sy: number, ex: number, ey: number) {
    for (var i = 0; i < ey - sy; i++) {
      // Text updates invalidRows
      this.text(char.charAt(0).repeat(ex - sx), sx, sy + i);
    }
  }

  scroll(x: number) {
    if (x + this.scrollTop + this.height > this.maxHeight) return;
    this.scrollTop += x;
    this.render(true);
  }

  scrollTo(x: number) {
    if (x + this.height > this.maxHeight) return;
    this.scrollTop = x;
    this.render(true);
  }

  invalidateRow(x: number) {
    this.invalidRows.add(x);
  }

  render(ignoreCache: boolean = false) {
    for (var i = 0; i < this.height; i++) {
      if (!ignoreCache && !this.invalidRows.has(i + this.scrollTop)) {
        break;
      }
      driver.setLine(i, this.buf[i + this.scrollTop]);
    }
  }
};

// ASCIIBuffer but has color
class ColoredASCIIBuffer extends ASCIIBuffer {
  // Access like this.spancache[line][index]
  spancache: ColoredSpan[][];
  constructor(nw: number, nh: number, maxHeight: number = nh, bindToScreen = true) {
    super(nw, nh, maxHeight, bindToScreen);
    this.spancache = [];
    for (var i = 0; i < maxHeight; i++) {
      this.spancache.push([]);
    }
  }
  clear() {
    this.clear_col();
    super.clear();
  }
  clear_col(line?: number) {
    if (line === undefined) {
      this.spancache = [];
      for (var i = 0; i < this.maxHeight; i++) {
        this.spancache.push([]);
      }
    } else {
      this.spancache[line] = [];
    }
    if (this.boundToScreen)
      this.render(true);
  }
  color(line: number, from: number, to: number, fcol?: Color, bcol?: Color, bold: boolean = false) {
    var cspan: ColoredSpan = new ColoredSpan();
    cspan.fgcol = fcol;
    cspan.bgcol = bcol;
    cspan.bold = bold;
    cspan.from = from;
    cspan.to = to;
    this.spancache[line].push(cspan);
    this.invalidRows.add(line);
  }
  useColorJSON(json: ColorInJSON[]) {
    for (var i = 0; i < json.length; i++) {
      var el = json[i];
      // color() updates invalidRows
      this.color(el.y, el.xstart, el.xend, el.fg, el.bg);
    }
  }
  render(ignoreCache: boolean = false) {
    for (var v = 0; v < this.height; v++){
      var tv = v + this.scrollTop;
      if (!ignoreCache) {
        if (!this.invalidRows.has(tv)) {
          break;
        }
      }
      this.spancache[tv].sort(
        (a, b) => (a.from < b.from) ? -1 : (a.from == b.from ? 0 : 1));
      var spanindex = 0;
      var buf = "";
      for (var x = 0; x < this.width; x++) {
        var cspan = this.spancache[tv][spanindex];
        if (cspan) {
          if (x === cspan.from) {
            buf += cspan.to_spantext();
          }
          if (x === cspan.to) {
            buf += driver.getClosing();
            spanindex++;
          }
        }
        buf += this.buf[tv].charAt(x);
      }
      driver.setLine(v, buf);
    }
    this.invalidRows.clear();
  }
};
var title = driver.title;

function initializeWindow(width: number, height: number) {
  driver.initWindow(width, height);
}

export { ASCIIBuffer, Color, ColoredASCIIBuffer, title, colors, ColorInJSON, initializeWindow };
