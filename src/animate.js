"use strict";
// File summary
// animate.ts: Random utilities for synchronous and asynchronous rendering and input
Object.defineProperty(exports, "__esModule", { value: true });
const tickloop = require("./tickloop");
const importdriver_1 = require("./importdriver");
// All methods here are compatible with ColoredASCIIBuffer
function writeText(mainbuffer, txt, x, y, maxlen) {
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
exports.writeText = writeText;
function animateImg(buf, animation, startx, starty) {
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
exports.animateImg = animateImg;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve.bind(this), ms));
}
exports.sleep = sleep;
function waitForKey() {
    return new Promise(function (resolve) {
        var handle = importdriver_1.driver.on("key", function (key) {
            importdriver_1.driver.removeByIndex("key", handle);
            resolve(key);
        });
    });
}
exports.waitForKey = waitForKey;
//# sourceMappingURL=animate.js.map