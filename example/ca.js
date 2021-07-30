const request = require('request-promise');


async function run(){
	let p = 1
	const res = await request({
		url: `https://tieba.baidu.com/p/totalComment?tid=6813296801&pn=111`,
		timeout: 5000,
		headers: {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
			// "Cookie": "wise_device=0; BAIDUID=68FEE63F778BA0DC5C0880EA1EE4C3E9:FG=1; BAIDUID_BFESS=68FEE63F778BA0DC5C0880EA1EE4C3E9:FG=1; Hm_lvt_98b9d8c2fd6608d564bf2ac2ae642948=1627006884; BAIDU_WISE_UID=wapp_1627006884013_695; USER_JUMP=-1; __yjs_duid=1_6d53621fbd2f3be30b2ff671996cd0701627006890956; ab_sr=1.0.1_ZTQ1MWNiYzM4NTQ0ZDhjYzU5YzkwYzQ1NWEwZmExN2RiZjY1YWUzMDFkOWRmZTI5NDU0NjUwNGY5NjgyODgwMDViNTNiMWM2N2VlMTdmMjVkODA1MjVmZjI2NTI2YTY2NjI1YTQzZTE0ZWJmMjk2N2M1NmQyNzhhZjA1YzFiZjE5ZWI2NmY1MTk1ZTRjOGJjYjY3OGRjMGQ4MWM4MTc5NQ==; st_data=8bc2335205ce643aa583b3651da17c3fee7e08ade56389dc951fc6bcc023bf9ba165027c4e31e17f32820bef05c9a1547aa3f25ea879d469981e889b4c17e2c469d18791a0e055720ba70c462b3006b18afe8fc38624b913a530e1e14b73c9880e74cfb38d6ba007e40819bf70ffe381c6406240a259e06b382d2d45fed6fd8a; st_key_id=17; st_sign=73872738; Hm_lpvt_98b9d8c2fd6608d564bf2ac2ae642948=1627006906",
			// Accept: 'application/json, text/javascript, */*; q=0.01',
			Host: 'tieba.baidu.com',
			Referer: 'https://tieba.baidu.com/',
			// Pragma: 'no-cache',
			// 'X-Requested-With': 'XMLHttpRequest',
		}
	}).catch(e => {
		console.log('请求超时', host)
		return null
	});
	const user_list = JSON.parse(res).data.user_list;
	const ids = Object.keys(user_list);
	console.log(ids.map(id => user_list[id].nickname).filter(name => name), '爬取！完成')
}

run();