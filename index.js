const grab = require('./grab');
const Iconv = require('iconv-lite');
const base64decode = require('./base64decode');
const fetch = require('node-fetch');
// https://www.manhuaren.com/
// http://mangabz.com/m${id}
// https://www.soman.com/comic.html?comicname=%E5%A4%A9%E4%B8%8A%E5%A4%A9%E4%B8%8B&source=Xmanhua



grab('http://mangabz.com/242bz/', {
	name: '篮球少年王',
	target: '.detail-list-item a',
	host: 'http://mangabz.com/'
}, (res) => {
	const text = res.split('eval(')[1].split(')\n')[0];
	eval('global.func = ' + text);
	eval(global.func);
	return [
		newImgs
	];
})


// grab('https://www.77mh.cc/colist_110020.html', {
// 	name: '啊啊啊',
// 	target: '.ar_list_col a',
// 	host: 'https://www.77mh.cc'
// }, (res) => {
// 	const text = res.split('eval(')[1].split(')\n')[0];
// 	eval('global.func = ' + text);
// 	eval(global.func);
// 	console.log(msg)
// 	return [
// 		msg.split("|").map(src => (`https://a16c.gdbyhtl.net:64443/h53/${src}.webp`))
// 	];
// })


// grab('http://m.pufei.org/manhua/74/index.html', {
// 	name: '啊啊啊',
// 	imageHost: 'http://res.img.scbrxhwl.com/',
// 	host: 'http://m.pufei.org',
// 	target: '#chapterList2 a',
// 	encoding: false,
// }, (res, url, title) => {
// 	const text = Iconv.decode(res, 'gb2312');
// 	const cp = text.split('cp="')[1].split('";')[0];
// 	const newImgs = eval(eval(base64decode(cp).slice(4)));
// 	return [newImgs, title];
// })


// grab('http://m.ikkdm.com/comiclist/4/', {
// 	name: '不不不',
// 	host: 'http://m.ikkdm.com',
// 	target: '#list a',
// 	urlReplace: ['1.htm','{index}.htm'],
// 	titleReplace: ['海贼王',''],
// 	imageHost: 'https://tu.kukudm.com/',
// 	encoding: null,
// 	async beforeFunction(item){
// 		const arr = [];
//         let index = 1;
//         let total = 2;
// 		while(index <= total){
// 			console.log(item)
// 			const [url] = item;
// 			const host = url.replace('{index}', index);
// 			const res = await fetch(host, {
// 				method: 'get',
// 				timeout: 5000,
// 				headers: {
// 					"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1",
// 				}
// 			})
// 			.then(async (res) => (await res.buffer()))
// 			.catch(e => {
// 				console.log('请求超时', host, e)
// 				return null
// 			});

// 			if(res){
// 				text = Iconv.decode(res, 'gb2312');
//                 total = text.match(/<li>\d+\/\d+/)[0].split('/')[1];
//                 const img = text.split(`IMG SRC='"+m2007+"`)[1].split(`'></a>`)[0];
//                 arr.push(encodeURI(img))
// 				index++;
//             }else{
//                 console.log('请求超时', host)
//             }
// 		}

// 		return arr;
// 	}
// }, res => [res])

// grab('https://www.kanbl.cc/manhua/5066.html', {
// 	name: '捡了东西的狼',
// 	host: 'https://www.kanbl.cc',
// 	target: '.item a',
// }, (res) => {
// 	const imgs = res.match(/https:\/\/img.3250mh.com.*\d+.jpg/g);
// 	const title = res.match(/\<strong\>(.*.)\<\/strong\>/)[1]
// 	return [
// 		imgs,
// 		title
// 	];
// })