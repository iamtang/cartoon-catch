"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtml = exports.getHost = exports.isArray = exports.createFileName = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const Iconv = __importStar(require("iconv-lite"));
const setting_json_1 = __importDefault(require("../../setting.json"));
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
function getHtml(pageUrl, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield node_fetch_1.default(pageUrl, {
            method: 'get',
            timeout: 5000,
            headers: Object.assign({ "User-Agent": setting_json_1.default.ua }, options.headers)
        })
            .then((html) => __awaiter(this, void 0, void 0, function* () { return (options.encoding ? yield html.text() : yield html.buffer()); }))
            .then((html) => typeof html === 'string' ? html : Iconv.decode(html, 'gb2312'));
    });
}
exports.getHtml = getHtml;
