// File summary
// eventemitter.ts: EventEmitter polyfill for platforms that don't support it or
//   have spotty or incosistent support (like browser, which relies on a DOMElement)

type EventCallback = (...args: any) => void;
type CallbackHandle = {
  cb: EventCallback;
  times: number;
};

interface IEventEmitter<EventStr extends string> {
  emit(ev: EventStr, ...args: any);
  addListener(ev: EventStr, cb: EventCallback);
  on(ev: EventStr, cb: EventCallback);
  removeHandler(ev: EventStr, cb: EventCallback);
  off(ev: EventStr, cb: EventCallback);
  once(ev: EventStr, cb: EventCallback);
  removeAllListeners(ev: EventStr);
  eventNames(): EventStr[];
  getMaxListeners(): number;
  listenerCount(ev: EventStr): number;
  listeners(ev: EventStr): EventCallback[];
  rawListeners(ev: EventStr): CallbackHandle[];
}

abstract class EventEmitter<EventStr extends string> implements IEventEmitter<EventStr> {
  private cbs: { [ev: string]: CallbackHandle[] };

  constructor() {
    this.cbs = {};
  }

  emit(ev: EventStr, ...args: any[]) {
    if (!this.cbs[ev]) {
      this.cbs[ev] = [];
    }
    for (var i = 0; i < this.cbs[ev].length; i++) {
      var cobj = this.cbs[ev][i];
      if (cobj) {
        cobj.cb(...args);
        cobj.times--;
        if (cobj.times === 0) {
          delete this.cbs[ev][i];
        }
      }
    }
  }

  // Add/Remove listeners
  addListener(ev: EventStr, cb: EventCallback) {
    this.on(ev, cb);
  }
  on(ev: EventStr, cb: EventCallback, times: number = Infinity): number {
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
  removeHandler(ev: EventStr, cb: EventCallback) {
    this.off(ev, cb)
  }
  off(ev: EventStr, cb: EventCallback) {
    delete this.cbs[this.cbs[ev].findIndex(v => v.cb === cb)];
  }
  once(ev: EventStr, cb: EventCallback) {
    this.on(ev, cb, 1);
  }
  removeAllListeners(ev: EventStr) {
    this.cbs[ev] = [];
  }
  removeByIndex(ev: EventStr, index: number) {
    delete this.cbs[ev][index];
  }

  // Querying events
  abstract eventNames(): EventStr[];
  getMaxListeners(): number { return Infinity; }
  listenerCount(ev: EventStr): number { return this.cbs[ev].length; }
  listeners(ev: EventStr): EventCallback[] { return this.cbs[ev].map(v => v.cb); }
  rawListeners(ev: EventStr): CallbackHandle[] { return this.cbs[ev]; }
}

export { IEventEmitter, EventEmitter, EventCallback };