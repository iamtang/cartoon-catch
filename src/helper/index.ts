function createFileName(){
    return `${Date.now()}${Math.ceil(Math.random() * 5000 + 5000)}`;
}

export {
	createFileName
}