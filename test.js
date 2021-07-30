const request = require('request-promise');
const u = require('./u');
const base64decode = require('./base64decode');
const download = require('./download');
const Iconv = require('iconv-lite');

// https://www.manhuaren.com/
// http://mangabz.com/m${id}
// https://www.soman.com/comic.html?comicname=%E5%A4%A9%E4%B8%8A%E5%A4%A9%E4%B8%8B&source=Xmanhua
// http://m.ikkdm.com/comiclist/3007/77871/1.htm


async function other() {
    let i = 1;
    while(i <= 24){
        let j = 1;
        const url = `https://twocomic.com/view/comic_224.html?ch=${i}-${j}`;
        const {page} = u(j, url);
        const arr = [];
        while(j <= page){
            const url = `https://twocomic.com/view/comic_224.html?ch=${i}-${j}`;
            const {img} = u(j, url);
            arr.push({
                url: img,
                path: `../石纪元/第${i}话/`,
                fileName: j.toString()
            })
            j++;
        }
        await download(arr, {title: `第${i}话`, parallel: 4})
        i++;
    }
}


other().then()
