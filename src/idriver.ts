// File summary
// idriver.ts: A basic driver that provides all base functionality to support
//   many platforms. Currently supports: ["es6 browser", "node cli", "raspberry pi"]

import { IEventEmitter } from "./eventemitter";

/* Event 'key'
 * Arguments: (key: string)
 * Emitted (continously) when a key is held down. If an key that can be mapped
 * to a character is pressed, except numpad keys, its string representation will
 * be passed. If the Enter key is pressed, either a newline ('\n', ASCII 0x0A LF)
 * or a carriage return ('\r', ASCII 0x0D CR) will be passed. Backspace generates
 * ('\b', ASCII 0x7F DEL). Tab generates ('\t', ASCII 0x09 TAB). Pressing down
 * any other key is UNDEFINED BEHAVIOR. The key event may not even be emitted.
*/
type DriverEventStr = "key";

// Represents a js driver that can perform specific actions,
// such as display text onscreen
interface IDriver extends IEventEmitter<DriverEventStr> {
  initWindow(width: number, height: number);
  // Sets the title of the window. May not have any
  // effect on some platforms.
  title(str: string): string;
  setLine(line: number, content: string);
  makeColor(r: number, g: number, b: number): string;
  colorDepth(): number; // In bits
  getText(fcol: string, bcol: string, bold: boolean): string;
  getClosing(): string;
  platform(): string;
  width(): number;
  height(): number;
  // Returns a detailed string about the platform.
  // The format of this string is implementation-defined.
  // An example would be the User-Agent string on a browser.
  detailedPlatformString(): string;
}

export { IDriver, DriverEventStr };