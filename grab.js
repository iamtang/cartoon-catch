const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Iconv = require('iconv-lite');
var log = require('debug')('debug');
const download = require('./download');


const grap = async (url, options = {}, transform) => {
    options = Object.assign({host: '', encoding: true }, options)
    if(!options.target) throw new Error('请输入target');
    let html = await fetch(url, {
        method: 'get',
        timeout: 5000,
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",
        }
    })
    .then(async (res) => (options.encoding ? await res.text() : await res.buffer()))
    .catch(e => {
        log('请求超时', url, e)
        return null
    });
    !options.encoding && (html = Iconv.decode(html, 'gb2312'))
    const $ = cheerio.load(html);
    console.log(options.urlReplace, options.titleReplace)
    const urls = $(options.target).toArray().map(item => {
        let url = `${options.host}${$(item).attr('href')}`;
        let title = $(item).text().trim();
        options.urlReplace && (url = url.replace(...options.urlReplace))
        options.titleReplace && (title = title.replace(...options.titleReplace))
        return [url, title];
    });
    log(urls)
    return downloadImages(urls, options, transform)
} 

const downloadImages = async (urls, options = {}, transform) => {
    options = Object.assign({imageHost: '', headers: {} }, options)
	for(const item of urls){
        let url, title, result;
        if(typeof item === "object"){
            [url, title] = item;
        }else{
            url = item;
        }

        if (options.beforeFunction) {
            result = await options.beforeFunction(item)
        }else{
            log('发起请求', url);
            result = await fetch(url, {
                method: 'get',
                timeout: 5000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",
                    ...options.headers
                }
            })
            .then(async (res) => (options.encoding ? await res.text() : await res.buffer()))
            .catch(e => {
                log('请求超时', url, e)
                urls.push(item)
                return null
            });
            log('接收请求', url)
        }
       
        if(result){
			const [imgs, fileName = title] = transform(result, url, title);
            let i = 1;
            let arr = [];
            for(let src of imgs){
                arr.push({
                    url: `${options.imageHost}${src}`,
                    path: `../${options.name}/${fileName}/`,
                    fileName: i,
                    extract: options.extract
                })
                i++;
            }
            await download(arr, {title: fileName, parallel: options.parallel})
        }else{
            log('请求出错', result)
        }
    }
    log('\n========全部下载完成========')
    process.exit(0)
}


module.exports = grap;