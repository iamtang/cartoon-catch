# 漫画爬虫

可以爬虫90%的漫画网站，不支持可以提供网址给作者，作者更新代码。

如不懂使用，可查看[例子](https://github.com/iamtang/cartoon-catch/blob/master/example/index.js)

## 实例
```typescript
// import grab from 'cartoon-catch'; // ts
const {default: grab} = require('cartoon-catch') // js
const options = {
	name: '../漫画名‘,
	host: 'http://xx.com',
	target: '.list a'
}

grab('http://xx.com/m12345', options, function(html, url, title){
	const img = html.match(/https:\/\/img.xxx.com.*\d+.jpg/g)
	const title = html.match(/\<strong\>(.*.)\<\/strong\>/);
	return [imgs, title]
})
```

## options 参数
|参数名|值|是否必填|类型|备注|
|:----|:----|:----|:----|:----|
| name  | ../鬼灭之刃 | 是 | string | 指定下载路径 |
| target | .list a | 是 | string | 跳转到详情的dom |
| host  | http://xxx.com | 否 | string | 设置详情页host, 默认使用页面host |
| imageHost | http://cdn.xxx.com | 否 | string | 图片地址的host，如无就无需传 |
| encoding | true | 否 | boolean | 请求返回值乱码时传false |
| headers | {} | 否 | object | 自定义头部 |
| urlReplace | ['1.htm', '{index}'] | 否  | array | url替换 |
| titleReplace | ['鬼灭之刃', '鬼灭'] | 否  | array | title替换 |
| beforeFunction | function([url, title]){} | 否  | function | 自定义爬取方式 |
| downloadOptions | {} | 否 | object | 设置下载图片参数 |


## downloadOptions 参数
|参数名|值|是否必填|类型|备注|
|:----|:----|:----|:----|:----|
| extract  | jpg | 否 | string | 下载图片后缀，默认jpg |
| parallel  | 5 | 否 | number | 并行下载，默认5 |
| timeout  | 5000 | 否 | number | 请求超时时间，默认5000 |
| gainInterval  | 3000 | 否 | number | 重试时间，默认3000 |
| againTimes  | 0 | 否 | number | 重试次数，默认无限次 |


## 其他
- 如果需要DEBUG，环境变量传入DEBUG=debug
- 支持爬虫网站如下

|网址|
|:---|
|https://www.manhuaren.com|
|http://mangabz.com|
|https://www.soman.com|
|https://m.kuaikanmanhua.com|
|https://www.77mh.cc|
|http://m.pufei.org|
|http://m.ikkdm.com|
|https://www.kanbl.cc|
|https://m.36mh.com/|
|https://m.kuaikanmanhua.com/|
|http://www.qiman6.com|
|...|