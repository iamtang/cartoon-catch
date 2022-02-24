from CartoonCatch.main import CartoonCatch
from pyquery import PyQuery as pq
import os
def main(): #mh-item
    name = input('请输入要下载的动漫名:')
    host = 'http://mangabz.com'
    doc = pq(url=host + '/search?title=' + name, headers={"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1"})
    dom = doc('.manga-item')
    arr = []
    strs = ''
    i = 1
    for item in dom.items():
        title = item.find('.manga-item-title').text()
        strs = strs + str(i) + '.' + title + '\n'
        arr.append({
            'src': host + item.attr('href'), 
            'name': title
        })
        i = i + 1
    key = input('请输入需要下载的编号:\n\n' + strs + '\n编号:')
    path = input('下载到('+os.getcwd()+'):')
    target = arr[int(key) - 1]
    cc = CartoonCatch(target['src'], {
        'name': target['name'],
        'host': 'http://mangabz.com',
        'path': path
    })
    cc.download()

main()