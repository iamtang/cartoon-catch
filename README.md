# 漫画爬虫

可以爬虫90%的漫画网站，不支持可以提供网址给作者，作者更新代码。


## 实例
```js
grab('需要爬取的漫画url', options, transform(html, url, title){})
```
## options 参数
|参数名|值|是否必填|类型|备注|
|:----|:----|:----|:----|:----|
| host  | http://xxx.com | 是 | string | 网站域名 |
| name  | ../鬼灭之刃 | 是 | string | 指定下载路径 |
| target  | .list a | 是 | string | 获取跳转到详情页的target class |
| imageHost  | http://cdn.xxx.com | 否 | string | 图片地址的host，如无就无需传 |
| encoding  | true | 否 | boolean | 请求返回值乱码时传false |
| headers  | {} | 否 | object | 自定义头部 |
| urlReplace  | ['1.htm', '{index}'] | 否  | array | url替换 |
| titleReplace  | ['鬼灭之刃', '鬼灭'] | 否  | array | title替换 |
| beforeFunction  | function([url, title]){} | 否  | function | 自定义爬取方式 |
| downloadOptions  | {} | 否 | object | 设置下载图片参数 |


## downloadOptions 参数
|参数名|值|是否必填|类型|备注|
|:----|:----|:----|:----|:----|
| extract  | jpg | 否 | string | 下载图片后缀，默认jpg |
| parallel  | 5 | 否 | number | 并行下载，默认5 |
| timeout  | 5000 | 否 | number | 请求超时时间，默认5000 |
| gainInterval  | 3000 | 否 | number | 重试时间，默认3000 |
| againTimes  | 0 | 否 | number | 重试次数，默认无限次 |


```js
const transform = (html, url, title) => {
	// 根据返回的html文档获取需要下载的漫画图片地址集合
	const imgPathArr = res.match(/https:\/\/img.xxx.com.*\d+.jpg/g);
	const title = res.match(/\<strong\>(.*.)\<\/strong\>/)[1]
	return [
		imgPathArr,
		title
	];
}
```

