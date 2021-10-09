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
exports.downloadFile = exports.download = void 0;
const progress_1 = __importDefault(require("progress"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const debug_1 = __importDefault(require("debug"));
const setting_json_1 = __importDefault(require("../setting.json"));
const helper_1 = require("./helper");
const log = debug_1.default.debug('debug');
const error = debug_1.default.debug('error');
let bar = null;
function download(images, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title = '名称', parallel = 5 } = options || {};
        const total = images.length;
        bar = new progress_1.default(`${title}(:current/:total): [:bar] [:percent]`, { total: +total, width: 50 });
        let queue = parallel < total ? parallel : total;
        let finish = null;
        function callback(allPath, n) {
            bar.tick(1);
            const image = images.shift();
            queue--;
            log(allPath, n);
            if (image) {
                queue++;
                downloadFile(image, options, callback);
            }
            if (queue <= 0) {
                finish(`${title}下载完成`);
            }
            return;
        }
        return new Promise((resolve) => {
            for (let i = 0; i < parallel; i++) {
                const image = images.shift();
                image && downloadFile(image, options, callback);
            }
            finish = resolve;
        });
    });
}
exports.download = download;
function downloadFile(image, options, callback) {
    const { timeout = 5000, gainInterval = 3000, againTimes = 0, headers = {} } = options || {};
    let { url, path = '/', fileName = helper_1.createFileName(), extract = 'jpg' } = image || {};
    const allPath = `${path}${fileName}.${extract}`;
    if (!url)
        return callback(allPath, 2);
    url = url.indexOf('http') !== 0 ? `http:${url}` : url;
    let timer = null;
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path, { recursive: true });
    }
    const writeStream = fs_1.default.createWriteStream(allPath);
    const timeoutCallback = () => {
        writeStream.destroy(new Error('timeout'));
    };
    let tryAgain = null;
    const failCallBack = () => {
        image.againTimes = image.againTimes ? image.againTimes + 1 : 1;
        if (againTimes === 0 || image.againTimes <= againTimes) {
            downloadFile(image, options, callback);
        }
        else {
            bar.interrupt(`${image.url}, 超过重试次数！`);
        }
    };
    writeStream
        .on('finish', () => {
        clearTimeout(timer);
        callback(allPath, 1);
    })
        .on('error', (err) => {
        error(`${url} 下载错误 ${err}`);
        clearTimeout(tryAgain);
        tryAgain = setTimeout(failCallBack, gainInterval);
    })
        .on('pipe', () => {
        clearTimeout(timer);
        timer = setTimeout(timeoutCallback, timeout);
    })
        .on('drain', () => {
        clearTimeout(timer);
        timer = setTimeout(timeoutCallback, timeout);
    });
    node_fetch_1.default(url, {
        timeout: timeout + 300,
        headers: Object.assign({ "User-Agent": setting_json_1.default.ua }, headers)
    })
        .then(res => res.body.pipe(writeStream))
        .catch((err) => {
        error(`${url} 请求超时 ${err}`);
        clearTimeout(tryAgain);
        tryAgain = setTimeout(failCallBack, gainInterval);
    });
}
exports.downloadFile = downloadFile;
