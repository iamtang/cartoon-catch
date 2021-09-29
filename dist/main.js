"use strict";
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
const debug_1 = __importDefault(require("debug"));
const download_1 = require("./download");
const helper_1 = require("./helper");
const log = debug_1.default.debug('debug');
const grap = (pageUrl, options, transform) => __awaiter(void 0, void 0, void 0, function* () {
    const host = helper_1.getHost(pageUrl);
    options = Object.assign({ host: '', encoding: true }, options);
    if (!options.target)
        throw new Error('请输入target');
    let html = yield helper_1.getHtml(pageUrl, {
        headers: options.headers
    })
        .catch(e => {
        log(`请求超时 ${pageUrl} ${e}`);
        return null;
    });
    if (!html)
        return null;
    const $ = cheerio_1.default.load(html);
    const urls = $(options.target).toArray().map(item => {
        let url = $(item).attr('href');
        if (!/^http(s)?:\/\//.test(url)) {
            url = `${options.host || host}${url}`;
        }
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
        if (helper_1.isArray(item)) {
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
            result = yield helper_1.getHtml(url, {
                headers: options.headers
            })
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
            yield download_1.download(arr, Object.assign({ title: fileName }, options.downloadOptions));
        }
        else {
            log('请求出错', result);
        }
    }
    log('\n========全部下载完成========');
    process.exit(0);
});
exports.default = grap;
