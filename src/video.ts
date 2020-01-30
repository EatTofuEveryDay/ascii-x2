import * as tickloop from "./tickloop";
import { ColorInJSON } from "./colors";
import { ColoredASCIIBuffer } from "./buffer";

type VideoMetadata = {
  length: number;
  use20fps: boolean;
  filepath: string;
}

type VideoFrame = {
  // Print-viewable
  view: string[];
  color?: ColorInJSON[];
}


type VideoChunk = {
  frames: VideoFrame[];
}

// 75x30 Video buffer 10 or 20 fps, with color
// Highly optimized

class Video {
  currentFrame: number;
  chunks: VideoChunk[];
  metadata: VideoMetadata;
  buffer: ColoredASCIIBuffer;
  paused: boolean = false;

  constructor(meta: VideoMetadata) {
    this.metadata = meta;
  }

  // Allows custom streaming functionality
  addChunk(chunk: VideoChunk) {
    this.chunks.push(chunk);
  }

  popFrame(): VideoFrame {
    if (this.chunks.length === 0) return;
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

  playToEnd(): Promise<void> {
    var _this = this;
    this.currentFrame = 0;
    return new Promise(function (resolve, reject) {
      var eventStr: "tick10" | "tick20";
      if (_this.metadata.use20fps) {
        eventStr = "tick20";
      } else {
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

export { Video, VideoChunk, VideoMetadata, VideoFrame };