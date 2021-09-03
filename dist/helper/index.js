"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHost = exports.isArray = exports.createFileName = void 0;
function createFileName() {
    return `${Date.now()}${Math.ceil(Math.random() * 5000 + 5000)}`;
}
exports.createFileName = createFileName;
function isArray(t) {
    return Object.prototype.toString.call(t) == '[object Array]';
}
exports.isArray = isArray;
function getHost(url) {
    const urlArr = url.match(/^http(s)?:\/\/(.*?)\//);
    return urlArr ? urlArr[0] : null;
}
exports.getHost = getHost;
//# sourceMappingURL=index.js.map