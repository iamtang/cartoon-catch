
import cheerio from 'cheerio'
import Debug from 'debug'
import { download } from './download'
import { OptionsInterface } from './interface/main.interface'
import { isArray, getHost, getHtml } from './helper'

const log = Debug.debug('debug')
const error = Debug.debug('error')

const grap = async (pageUrl: string, options: OptionsInterface, transform: Function) => {
    const {
        target, 
        headers = {}, 
        slice = [], 
        urlReplace, 
        titleReplace, 
        host = getHost(pageUrl)
    } = options;
    if(!target) throw new Error('请输入target');
    let html = await getHtml(pageUrl, {
        headers
    })
    .catch(e => {
        error(`请求超时 ${pageUrl} ${e}`)
        return null
    });
    if(!html) return null;
    const $ = cheerio.load(html);
    const urls = $(target).toArray().slice(...slice).map(item => {
        let url = $(item).attr('href');
        if(!/^http(s)?:\/\//.test(url)){
            url = `${host}${url}`;
        }
        let title = $(item).text().trim();
        urlReplace && (url = url.replace(urlReplace[0], urlReplace[1]))
        titleReplace && (title = title.replace(titleReplace[0], titleReplace[1]))
        return [url, title];
    });
    log(urls)
    return downloadImages(urls, options, transform)
} 

const downloadImages = async (urls, options: OptionsInterface, transform: Function) => {
    const { 
        beforeFunction, 
        headers = {}, 
        imageHost = '', 
        name, 
        extract, 
        downloadOptions = {} 
    } = options;
	for(const item of urls){
        let url, title, result;
        if(isArray(item)){
            [url, title] = item;
        }else{
            url = item;
        }

        if (beforeFunction) {
            result = await beforeFunction(item)
        }else{
            log('发起请求', url);
            result = await getHtml(url, {
                headers
            })
            .catch(e => {
                error('请求超时', url, e)
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
                    url: `${imageHost}${src}`,
                    path: `${name}/${fileName}/`,
                    fileName: i,
                    extract
                })
                i++;
            }
            await download(arr, {title: fileName, ...downloadOptions})
        }else{
            error('请求出错', result)
        }
    }
    log('\n========全部下载完成========')
    process.exit(0)
}

export default grap