"use strict";
// File description
// colors.ts: Color support
Object.defineProperty(exports, "__esModule", { value: true });
const importdriver_1 = require("./importdriver");
// Immutable
class Color {
    constructor(nr, ng, nb) {
        this.r = nr;
        this.g = ng;
        this.b = nb;
    }
}
exports.Color = Color;
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
exports.colors = colors;
class ColoredSpan {
    to_spantext() {
        var fgstr = (this.fgcol === undefined) ? "initial" : importdriver_1.driver.makeColor(this.fgcol.r, this.fgcol.g, this.fgcol.b);
        var bgstr = (this.bgcol === undefined) ? "initial" : importdriver_1.driver.makeColor(this.bgcol.r, this.bgcol.g, this.bgcol.b);
        return importdriver_1.driver.getText(fgstr, bgstr, this.bold);
    }
}
exports.ColoredSpan = ColoredSpan;
;
//# sourceMappingURL=colors.js.map