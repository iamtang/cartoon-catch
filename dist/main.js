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
const error = debug_1.default.debug('error');
const grap = (pageUrl, options, transform) => __awaiter(void 0, void 0, void 0, function* () {
    const { target, headers = {}, slice = [], urlReplace = [], titleReplace = [], host = helper_1.getHost(pageUrl) } = options;
    // const urlReplace: [any?, any?] = options.urlReplace || [];
    if (!target)
        throw new Error('请输入target');
    let html = yield helper_1.getHtml(pageUrl, {
        headers
    })
        .catch(e => {
        error(`请求超时 ${pageUrl} ${e}`);
        return null;
    });
    if (!html)
        return null;
    const $ = cheerio_1.default.load(html);
    const urls = $(target).toArray().slice(...slice).map(item => {
        let url = $(item).attr('href').replace(...urlReplace);
        if (!/^http(s)?:\/\//.test(url)) {
            url = `${host}${url}`;
        }
        let title = $(item).text().trim().replace(...titleReplace);
        return [url, title];
    });
    log(urls);
    return downloadImages(urls, options, transform);
});
const downloadImages = (urls, options, transform) => __awaiter(void 0, void 0, void 0, function* () {
    const { beforeFunction, headers = {}, imageHost = '', name, extract, downloadOptions = {} } = options;
    for (const item of urls) {
        let url, title, result;
        if (helper_1.isArray(item)) {
            [url, title] = item;
        }
        else {
            url = item;
        }
        if (beforeFunction) {
            result = yield beforeFunction(item);
        }
        else {
            log('发起请求', url);
            result = yield helper_1.getHtml(url, {
                headers
            })
                .catch(e => {
                error('请求超时', url, e);
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
                    url: `${imageHost}${src}`,
                    path: `${name}/${fileName}/`,
                    fileName: i,
                    extract
                });
                i++;
            }
            yield download_1.download(arr, Object.assign({ title: fileName }, downloadOptions));
        }
        else {
            error('请求出错', result);
        }
    }
    log('\n========全部下载完成========');
    process.exit(0);
});
exports.default = grap;
