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
const cheerio_1 = __importDefault(require("cheerio"));
const Iconv = __importStar(require("iconv-lite"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const debug_1 = __importDefault(require("debug"));
const download_1 = __importDefault(require("./download"));
const log = debug_1.default.debug('debug');
const grap = (url, options, transform) => __awaiter(void 0, void 0, void 0, function* () {
    options = Object.assign({ host: '', encoding: true }, options);
    if (!options.target)
        throw new Error('请输入target');
    let html = yield node_fetch_1.default(url, {
        method: 'get',
        timeout: 5000,
        headers: Object.assign({ "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1" }, options.headers)
    })
        .then((html) => __awaiter(void 0, void 0, void 0, function* () { return (options.encoding ? yield html.text() : yield html.buffer()); }))
        .then((html) => typeof html === 'string' ? html : Iconv.decode(html, 'gb2312'))
        .catch(e => {
        log(`请求超时 ${url} ${e}`);
        return null;
    });
    const $ = cheerio_1.default.load(html);
    const urls = $(options.target).toArray().map(item => {
        let url = `${options.host}${$(item).attr('href')}`;
        let title = $(item).text().trim();
        options.urlReplace && (url = url.replace(options.urlReplace[0], options.urlReplace[1]));
        options.titleReplace && (title = title.replace(options.titleReplace[0], options.titleReplace[1]));
        return [url, title];
    });
    log(urls);
    return downloadImages(urls, options, transform);
});
const downloadImages = (urls, options, transform) => __awaiter(void 0, void 0, void 0, function* () {
    options = Object.assign({ imageHost: '', headers: {}, downloadOptions: {} }, options);
    for (const item of urls) {
        let url, title, result;
        if (Object.prototype.toString.call(item) == '[object Array]') {
            [url, title] = item;
        }
        else {
            url = item;
        }
        if (options.beforeFunction) {
            result = yield options.beforeFunction(item);
        }
        else {
            log('发起请求', url);
            result = yield node_fetch_1.default(url, {
                method: 'get',
                timeout: 5000,
                headers: Object.assign({ "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1" }, options.headers)
            })
                .then((html) => __awaiter(void 0, void 0, void 0, function* () { return (options.encoding ? yield html.text() : yield html.buffer()); }))
                .then((html) => options.encoding ? html : Iconv.decode(html, 'gb2312'))
                .catch(e => {
                log('请求超时', url, e);
                urls.push(item);
                return null;
            });
            log('接收请求', url);
        }
        if (result) {
            const [imgs, fileName = title] = transform(result, url, title);
            let i = 1;
            let arr = [];
            for (let src of imgs) {
                arr.push({
                    url: `${options.imageHost}${src}`,
                    path: `${options.name}/${fileName}/`,
                    fileName: i,
                    extract: options.extract
                });
                i++;
            }
            yield download_1.default(arr, Object.assign({ title: fileName }, options.downloadOptions));
        }
        else {
            log('请求出错', result);
        }
    }
    log('\n========全部下载完成========');
    process.exit(0);
});
exports.default = grap;
//# sourceMappingURL=main.js.map