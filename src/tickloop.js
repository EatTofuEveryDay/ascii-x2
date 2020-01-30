"use strict";
// File summary
// tickloop.ts: Basic tick utility. 20 ticks/second default
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter_1 = require("./eventemitter");
class TickLoop extends eventemitter_1.EventEmitter {
    constructor() {
        super();
        var emit = this.emit.bind(this);
        this.parity = false;
        var _this = this;
        this.rawloop = setInterval((function () {
            emit("tick");
            emit("tick20");
            if (_this.parity)
                emit("tick10");
            _this.parity = !_this.parity;
        }), 50);
    }
    end() {
        clearInterval(this.rawloop);
    }
    eventNames() {
        return ["tick", "tick10", "tick20"];
    }
    // Override
    on(ev, cb) { return super.on(ev, cb); }
}
var tloop = new TickLoop();
function on(ev, fn) {
    return tloop.on(ev, fn);
}
exports.on = on;
function removeHandler(ev, handle) {
    tloop.removeByIndex(ev, handle);
}
exports.removeHandler = removeHandler;
//# sourceMappingURL=tickloop.js.map