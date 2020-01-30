"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("./src/buffer");
const width = 75;
const height = 30;
buffer_1.initializeWindow(width, height);
var buf = new buffer_1.ColoredASCIIBuffer(width, height);
buf.rect(0, 0, width, height);
buf.render();
//# sourceMappingURL=index.js.map