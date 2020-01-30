"use strict";
// File summary
// eventemitter.ts: EventEmitter polyfill for platforms that don't support it or
//   have spotty or incosistent support (like browser, which relies on a DOMElement)
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.cbs = {};
    }
    emit(ev, ...args) {
        if (!this.cbs[ev]) {
            this.cbs[ev] = [];
        }
        for (var i = 0; i < this.cbs[ev].length; i++) {
            var cobj = this.cbs[ev][i];
            if (cobj) {
                cobj.cb(args);
                cobj.times--;
                if (cobj.times === 0) {
                    delete this.cbs[ev][i];
                }
            }
        }
    }
    // Add/Remove listeners
    addListener(ev, cb) {
        this.on(ev, cb);
    }
    on(ev, cb, times = Infinity) {
        if (!this.cbs[ev]) {
            this.cbs[ev] = [];
        }
        var ret = null;
        for (var i = 0; i < this.cbs[ev].length; i++) {
            if (this.cbs[ev][i] === void 0) {
                ret = i;
                this.cbs[ev][i] = { cb: cb, times: times };
                break;
            }
        }
        if (ret === null) {
            ret = this.cbs[ev].length;
            this.cbs[ev].push({ cb: cb, times: times });
        }
        return ret;
    }
    removeHandler(ev, cb) {
        this.off(ev, cb);
    }
    off(ev, cb) {
        delete this.cbs[this.cbs[ev].findIndex(v => v.cb === cb)];
    }
    once(ev, cb) {
        this.on(ev, cb, 1);
    }
    removeAllListeners(ev) {
        this.cbs[ev] = [];
    }
    removeByIndex(ev, index) {
        delete this.cbs[ev][index];
    }
    getMaxListeners() { return Infinity; }
    listenerCount(ev) { return this.cbs[ev].length; }
    listeners(ev) { return this.cbs[ev].map(v => v.cb); }
    rawListeners(ev) { return this.cbs[ev]; }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=eventemitter.js.map