
import cheerio from 'cheerio'
import Debug from 'debug'
import download from './download'
import { OptionsInterface } from './interface/main.interface'
import { isArray, getHost, getHtml } from './helper'

const log = Debug.debug('debug')

const grap = async (pageUrl: string, options: OptionsInterface, transform: Function) => {
    const host = getHost(pageUrl);
    options = Object.assign({host: '', encoding: true }, options)
    if(!options.target) throw new Error('请输入target');
    let html = await getHtml(pageUrl, {
        headers: options.headers
    })
    .catch(e => {
        log(`请求超时 ${pageUrl} ${e}`)
        return null
    });
    if(!html) return null;
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
            result = await getHtml(url, {
                headers: options.headers
            })
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