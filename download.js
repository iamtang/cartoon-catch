const ProgressBar = require('progress');
const fs = require('fs');
const fetch = require('node-fetch');
var log = require('debug')('debug');

let bar = null;
async function download(images, options = {}){
    const { title = '名称', parallel = 5 } = options;
    const total = images.length;
    bar = new ProgressBar(`${title}(:current/:total): [:bar] [:percent]`, { total: +total, width: 50 });
    let queue = parallel < total ? parallel : total;
    let finish = null;
    
    function callback(allPath, n){
        bar.tick(1);
        const image = images.shift();

        queue--;
        if(image){
            queue++
            downloadFile(image, options, callback);
        }
        if(queue <= 0){
            log(`${title} 下载完成`);
            finish(`${title}下载完成`);
        }
    }

    return new Promise((resolve) => {
        for(let i = 0; i < parallel; i++){
            const image = images.shift();
            image && downloadFile(image, options, callback);
        }
        finish = resolve
    })
}

function downloadFile(image = {}, options = {}, callback = () => {}){
    const { timeout = 5000, gainInterval = 3000, againTimes = 0 } = options;
    let { url, path = '/', fileName = createFileName(), extract = 'jpg' } = image;
    const allPath = `${path}${fileName}.${extract}`;
    if(!url) return callback(allPath, 2);
    url = url.indexOf('http') !== 0 ? `http:${url}` : url;
    let timer = null;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true})
    }

    const writeStream = fs.createWriteStream(allPath);
    const timeoutCallback = () => { 
        writeStream.destroy('timeout')
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
            log(`${url} 下载错误`, err)
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

    fetch(url, {
        timeout: timeout + 300,
        header: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",

        }
    })
        .then(res => res.body.pipe(writeStream))
        .catch((err) => {
            log(`${url} 请求超时`, err);
            clearTimeout(tryAgain);
            tryAgain = setTimeout(failCallBack, gainInterval);
        })
}

function createFileName(){
    return `${Date.now()}${Math.ceil(Math.random() * 5000 + 5000)}`;
}

module.exports = download;