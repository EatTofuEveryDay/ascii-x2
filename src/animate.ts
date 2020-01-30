// File summary
// animate.ts: Random utilities for synchronous and asynchronous rendering and input

import * as tickloop from "./tickloop";
import { driver } from "./importdriver";
import { ASCIIBuffer } from "./buffer";

// All methods here are compatible with ColoredASCIIBuffer
function writeText(mainbuffer: ASCIIBuffer, txt: string, x: number, y: number, maxlen?: number): Promise<void> {
  return new Promise(function (resolve, reject) {
    var textSz = 0;
    var textLn = 0;
    var textArr = [txt];
    if (maxlen) {
      textArr = txt.split(new RegExp(`.{1,${maxlen}}`, "g"));
    }
    var evHandle = tickloop.on("tick", function () {
      mainbuffer.text(textArr[textLn].substr(0, textSz + 1), x, y + textLn);
      textSz++;
      if (textSz === textArr[textLn].length) {
        textLn++;
        textSz = 0;
        if (textLn === textArr.length) {
          tickloop.removeHandler("tick", evHandle);
          resolve();
          return;
        }
      }
    });
  });
}

function animateImg(buf: ASCIIBuffer, animation: string[][], startx: number, starty: number): Promise<void> {
  return new Promise(function (resolve, reject) {
    var cframe = 0;
    var evHandle = tickloop.on("tick", function () {
      for (var i = 0; i < animation[cframe].length; i++) {
        console.log(animation[cframe][i]);
        buf.text(animation[cframe][i], startx, starty + i);
      }
      cframe++;
      console.log(cframe);
      if (animation.length === cframe) {
        tickloop.removeHandler("tick", evHandle);
        resolve();
      }
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve.bind(this), ms));
}

function waitForKey(): Promise<string> {
  return new Promise(function (resolve) {
    var handle = driver.on("key", function (key) {
      driver.removeByIndex("key", handle);
      resolve(key);
    })
  });
}

export { writeText, sleep, waitForKey, animateImg };
