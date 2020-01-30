// File summary
// cmdline.ts: A driver for node.js

import { IDriver, DriverEventStr } from "../idriver";
import * as tty from "tty";
import { EventEmitter } from "../eventemitter";

const linebr = "\n";

class ConsoleDriver extends EventEmitter<DriverEventStr> implements IDriver {
  private detailedPlatform: string;
  private stdout: tty.WriteStream;
  constructor() {
    super();
    // Setup stdin for TTY use
    if (!process.stdout.isTTY) {
      throw new Error("Must be run in TTY mode.");
    }
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf-8");
    process.stdin.resume();
    process.stdin.on("data", function (key: string) {
      // simulate Ctrl-C to exit
      if (key === "\u0003") process.exit(0);
      else this.emit("key", key);
    }.bind(this));
    this.stdout = process.stdout as tty.WriteStream;
    this.stdout.cursorTo(0, 0);
    this.stdout.clearScreenDown();
    // Create detailed platform key
    this.detailedPlatform = "node:" + process.version;
    var versionKeys = Object.keys(process.versions);
    for (var i = 0; i < versionKeys.length; i++) {
      var thisKey = versionKeys[i];
      if (thisKey === "node") continue;
      this.detailedPlatform += " " + thisKey + ":" + process.versions[thisKey];
    }
  }
  initWindow(width: number, height: number) { }
  title(str: string = null): string {
    if (str) {
      process.title = str;
      process.stdout.write(`\x1b]2;${str}\x07`);
    }
    return process.title;
  }
  setLine(line: number, content: string) {
    this.stdout.cursorTo(0, line);
    this.stdout.write(content);
  }
  makeColor(r: number, g: number, b: number): string {
    return r + ";" + g + ";" + b;
  }
  colorDepth(): number { return this.stdout.getColorDepth(); }
  getText(fcol: string, bcol: string, bold: boolean): string {
    var boldtext = bold ? "\x1b[1m" : "";
    var fstr = (fcol === "initial") ? "" : `\x1b[38;2;${fcol}m`;
    var bstr = (bcol === "initial") ? "" : `\x1b[48;2;${bcol}m`;
    return boldtext + fstr + bstr;
  }
  getClosing(): string {
    return "\x1b[0m";
  }
  platform(): string {
    return "node cli";
  }
  detailedPlatformString(): string {
    return this.detailedPlatform;
  }
  eventNames(): DriverEventStr[] {
    return ["key"];
  }
  // Override
  on(ev: "key", cb: (key: string) => void): number { return super.on(ev, cb); }
}

var driver = new ConsoleDriver();

export { driver };