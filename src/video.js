"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tickloop = require("./tickloop");
// 75x30 Video buffer 10 or 20 fps, with color
// Highly optimized
class Video {
    constructor(meta) {
        this.paused = false;
        this.metadata = meta;
    }
    // Allows custom streaming functionality
    addChunk(chunk) {
        this.chunks.push(chunk);
    }
    popFrame() {
        if (this.chunks.length === 0)
            return;
        var frame = this.chunks[0].frames.shift();
        if (this.chunks[0].frames.length === 0) {
            this.chunks.shift();
        }
        return frame;
    }
    pause() {
        this.paused = true;
    }
    play() {
        this.paused = false;
    }
    playToEnd() {
        var _this = this;
        this.currentFrame = 0;
        return new Promise(function (resolve, reject) {
            var eventStr;
            if (_this.metadata.use20fps) {
                eventStr = "tick20";
            }
            else {
                eventStr = "tick10";
            }
            var handler = tickloop.on(eventStr, function () {
                if (this.paused) {
                    var cFrame = _this.popFrame();
                    _this.buffer.image(cFrame.view, 0, 0);
                    _this.buffer.clear_col();
                    _this.buffer.useColorJSON(cFrame.color);
                    _this.currentFrame++;
                    _this.buffer.render(true);
                    if (_this.currentFrame === _this.metadata.length) {
                        tickloop.removeHandler(eventStr, handler);
                        resolve();
                    }
                }
            });
        });
    }
}
exports.Video = Video;
//# sourceMappingURL=video.js.map