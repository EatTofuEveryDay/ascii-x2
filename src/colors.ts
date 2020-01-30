// File description
// colors.ts: Color support

import { driver } from "./importdriver";

// Immutable
class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  constructor(nr: number, ng: number, nb: number) {
    this.r = nr;
    this.g = ng;
    this.b = nb;
  }
}

type ColorInJSON = {
  fg?: Color;
  bg?: Color;
  xstart: number;
  xend: number;
  y: number;
};

const colors = {
  red: new Color(255, 0, 0),
  green: new Color(0, 255, 0),
  blue: new Color(0, 0, 255),
  yellow: new Color(255, 255, 0),
  cyan: new Color(0, 255, 255),
  pink: new Color(255, 0, 255),
  white: new Color(255, 255, 255),
  black: new Color(0, 0, 0)
};

class ColoredSpan {
  fgcol: Color;
  bgcol: Color;
  bold: boolean;
  from: number;
  to: number;
  to_spantext(): string {
    var fgstr = (this.fgcol === undefined) ? "initial" : driver.makeColor(this.fgcol.r, this.fgcol.g, this.fgcol.b);
    var bgstr = (this.bgcol === undefined) ? "initial" : driver.makeColor(this.bgcol.r, this.bgcol.g, this.bgcol.b);
    return driver.getText(fgstr, bgstr, this.bold);
  }
};

export { Color, ColorInJSON, colors, ColoredSpan };