import Progress from 'progress'
import fs from 'fs'
import nodeFetch from 'node-fetch'
import Debug from 'debug'
import config from '../setting.json';
import { ImageInterface, OptionsInterface } from './interface/download.interface';
import { createFileName } from './helper';

const log = Debug.debug('debug')
const error = Debug.debug('error')

let bar = null;

async function download(images: Array<ImageInterface>, options: OptionsInterface): Promise<string>{
    const { title = '名称', parallel = 5 } = options || {};
    const total = images.length;
    bar = new Progress(`${title}(:current/:total): [:bar] [:percent]`, { total: +total, width: 50, clear: true });
    let queue = parallel < total ? parallel : total;
    let finish = null;
    
    function callback(allPath, n): void{
        bar.tick(1);
        const image = images.shift();
        queue--;
        log(allPath, n);
        if(image){
            queue++
            downloadFile(image, options, callback);
        }
        if(queue <= 0){
            finish(`${title}下载完成`);
        }
		return;
    }

    return new Promise((resolve) => {
        for(let i = 0; i < parallel; i++){
            const image = images.shift();
            image && downloadFile(image, options, callback);
        }
        finish = resolve
    })
}

function downloadFile(image: ImageInterface, options: OptionsInterface, callback: Function): Function | void {
    const { timeout = 5000, gainInterval = 3000, againTimes = 0, headers = {} } = options || {};
    let { url, path = '/', fileName = createFileName(), extract = 'jpg' } = image || {};
    const allPath = `${path}${fileName}.${extract}`;
    if(!url) return callback(allPath, 2);
    url = url.indexOf('http') !== 0 ? `http:${url}` : url;
    let timer = null;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true})
    }

    const writeStream = fs.createWriteStream(allPath);
    const timeoutCallback = () => { 
        writeStream.destroy(new Error('timeout'))
    }

    let tryAgain = null;
    const failCallBack = () => { 
        image.againTimes = image.againTimes ? image.againTimes + 1 : 1;
        if(againTimes === 0 || image.againTimes <= againTimes){
            downloadFile(image, options, callback) 
        }else{
            bar.interrupt(`${image.url}, 超过重试次数！`);
        }
    };

    writeStream
        .on('finish', () => {
            clearTimeout(timer);
            callback(allPath, 1);
        })
        .on('error', (err) => {
            error(`${url} 下载错误 ${err}`)
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
        })

	nodeFetch(url, {
        timeout: timeout + 300,
        headers: {
            "User-Agent": config.ua,
            ...headers

        }
    })
    .then(res => res.body.pipe(writeStream))
    .catch((err) => {
        error(`${url} 请求超时 ${err}`);
        clearTimeout(tryAgain);
        tryAgain = setTimeout(failCallBack, gainInterval);
    })
}

export {
    download,
    downloadFile
}