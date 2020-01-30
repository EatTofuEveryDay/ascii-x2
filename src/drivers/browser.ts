// File summary
// browser.ts: A driver for "es6 browser"

import { IDriver, DriverEventStr } from "../idriver";
import { EventEmitter } from "../eventemitter";
var _title = document.querySelector("title");
var _content = document.querySelector("#content");

class BrowserDriver extends EventEmitter<DriverEventStr> implements IDriver {
  private _lines: HTMLParagraphElement[] = [];

  constructor() {
    super();
    window.addEventListener("keyup", function (ev: KeyboardEvent) {
      this.emit("key", ev.key);
    }.bind(this));
  }

  initWindow(width: number, height: number) {
    for (var i = 0; i < height; i++) {
      var el = document.createElement("p");
      this._lines.push(el);
      _content.appendChild(el);
    }
  }

  title(str: string): string {
    if (str) {
      _title.innerHTML = str;
    }
    return _title.innerHTML;
  }
  setLine(line: number, content: string) {
    this._lines[line].innerText = content;
  }
  makeColor(r: number, g: number, b: number): string {
    return `rgb(${r}, ${g}, ${b})`;
  }
  colorDepth() { return screen.colorDepth; };
  getText(fcol: string, bcol: string, bold: boolean): string {
    var boldexpr = bold ? "bold" : "normal";
    return `<span style="font-weight: ${boldexpr}; color: ${fcol}; background-color: ${bcol};">`;
  }
  getClosing(): string {
    return "</span>";
  }
  platform(): string {
    return "es6 browser";
  }
  detailedPlatformString(): string {
    return navigator.userAgent;
  }
  eventNames(): DriverEventStr[] {
    return ["key"];
  }

  // Override
  on(ev: "key", cb: (key: string) => void): number { return super.on(ev, cb); }
};

var driver = new BrowserDriver();

export { driver };