import "cross-fetch/polyfill";
import * as timers from "timers";

if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}

if (typeof TextDecoder === "undefined") {
  global.TextDecoder = require("util").TextDecoder;
}

if (typeof setImmediate !== "function") {
  global.setImmediate = timers.setImmediate;
  global.clearImmediate = timers.clearImmediate;
}

if (typeof fetch !== "function") {
  global.fetch = fetch;
}

export {};
