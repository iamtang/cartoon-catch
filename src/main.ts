
import cheerio from 'cheerio'
import * as Iconv from 'iconv-lite'
import nodeFetch from 'node-fetch'
import Debug from 'debug'
import download from './download'
import { OptionsInterface } from './interface/main.interface';
import { isArray, getHost } from './helper';


const log = Debug.debug('debug')

const grap = async (pageUrl: string, options: OptionsInterface, transform: Function) => {
    const host = getHost(pageUrl);
    options = Object.assign({host: '', encoding: true }, options)
    if(!options.target) throw new Error('请输入target');
    let html = await nodeFetch(pageUrl, {
        method: 'get',
        timeout: 5000,
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",
            ...options.headers
        }
    })
    .then(async (html) => (options.encoding ? await html.text() : await html.buffer()))
    .then((html: Buffer | string) => typeof html === 'string' ? html : Iconv.decode(html, 'gb2312'))
    .catch(e => {
        log(`请求超时 ${pageUrl} ${e}`)
        return null
    });
    const $ = cheerio.load(html);
    const urls = $(options.target).toArray().map(item => {
        let url = $(item).attr('href');
        if(!/^http(s)?:\/\//.test(url)){
            url = `${options.host || host}${url}`;
        }
        let title = $(item).text().trim();
        options.urlReplace && (url = url.replace(options.urlReplace[0], options.urlReplace[1]))
        options.titleReplace && (title = title.replace(options.titleReplace[0], options.titleReplace[1]))
        return [url, title];
    });
    log(urls)
    return downloadImages(urls, options, transform)
} 

const downloadImages = async (urls, options: OptionsInterface, transform: Function) => {
    options = Object.assign({imageHost: '', headers: {}, downloadOptions: {} }, options)
	for(const item of urls){
        let url, title, result;
        if(isArray(item)){
            [url, title] = item;
        }else{
            url = item;
        }

        if (options.beforeFunction) {
            result = await options.beforeFunction(item)
        }else{
            log('发起请求', url);
            result = await nodeFetch(url, {
                method: 'get',
                timeout: 5000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",
                    ...options.headers
                }
            })
            .then(async (html) => (options.encoding ? await html.text() : await html.buffer()))
            .then((html: any) => options.encoding ? html : Iconv.decode(html, 'gb2312'))
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
                    path: `${options.name}/${fileName}/`,
                    fileName: i,
                    extract: options.extract
                })
                i++;
            }
            await download(arr, {title: fileName, ...options.downloadOptions})
        }else{
            log('请求出错', result)
        }
    }
    log('\n========全部下载完成========')
    process.exit(0)
}

export default grap