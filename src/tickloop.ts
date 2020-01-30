// File summary
// tickloop.ts: Basic tick utility. 20 ticks/second default

import { EventEmitter } from "./eventemitter";

type TickLoopEventStr = "tick" | "tick10" | "tick20";

class TickLoop extends EventEmitter<TickLoopEventStr> {
  private rawloop: ReturnType<typeof setInterval>;
  private parity: boolean;
  constructor() {
    super();
    var emit = this.emit.bind(this);
    this.parity = false;
    var _this = this;
    this.rawloop = setInterval((function () {
      emit("tick");
      emit("tick20");
      if (_this.parity) emit("tick10");
      _this.parity = !_this.parity;
    }), 50);
  }
  end() {
    clearInterval(this.rawloop);
  }
  eventNames(): TickLoopEventStr[] {
    return ["tick", "tick10", "tick20"];
  }

  // Override
  on(ev: TickLoopEventStr, cb: () => void): number { return super.on(ev, cb); }
}

var tloop = new TickLoop();

function on(ev: TickLoopEventStr, fn: () => void): number {
  return tloop.on(ev, fn);
}

function removeHandler(ev: TickLoopEventStr, handle: number) {
  tloop.removeByIndex(ev, handle);
}

export { on, removeHandler };