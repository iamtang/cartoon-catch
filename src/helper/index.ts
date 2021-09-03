function createFileName(){
    return `${Date.now()}${Math.ceil(Math.random() * 5000 + 5000)}`;
}

function isArray (t) {
	return Object.prototype.toString.call(t)== '[object Array]'
}

function getHost(url){
	const urlArr = url.match(/^http(s)?:\/\/(.*?)\//);
	return urlArr ? urlArr[0] : null;
}

export {
	createFileName,
	isArray,
	getHost
}