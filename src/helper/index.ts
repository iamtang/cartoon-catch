import nodeFetch from 'node-fetch'
import * as Iconv from 'iconv-lite'
import config from '../../setting.json'
import { getHtmlInterface } from '../interface/helper.interface'


function createFileName(): string {
    return `${Date.now()}${Math.ceil(Math.random() * 5000 + 5000)}`;
}

function isArray (t: Object | Array<any>): boolean {
	return Object.prototype.toString.call(t)== '[object Array]'
}

function getHost(url: string): string | null{
	const urlArr = url.match(/^http(s)?:\/\/(.*?)\//);
	return urlArr ? urlArr[0] : null;
}


async function getHtml(pageUrl: string, options: getHtmlInterface): Promise<string|null> {
	return await nodeFetch(pageUrl, {
        method: 'get',
        timeout: 5000,
        headers: {
            "User-Agent": config.ua,
            ...options.headers
        }
    })
    .then(async (html) => (options.encoding ? await html.text() : await html.buffer()))
    .then((html: Buffer | string) => typeof html === 'string' ? html : Iconv.decode(html, 'gb2312'))
  
}

export {
	createFileName,
	isArray,
	getHost,
	getHtml
}