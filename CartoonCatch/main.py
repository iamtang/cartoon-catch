import execjs
from pyquery import PyQuery as pq
from CartoonCatch.download import download

defalutHeaders = {
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1',
}
class CartoonCatch:
    def __init__(self, url, options = {}):
        self.url = url
        self.options = options

    def getTemp(self, url):
        return pq(url=url, encoding='utf-8', headers=self.options.get('headers', defalutHeaders))

    def download(self):
        doc = self.getTemp(self.url)
        list = doc('.detail-list-item a')
        for item in list.items():
            arr = []
            url = self.options['host'] + item.attr('href')
            title = item.text()
            dom = self.getTemp(url)
            jsFunctionStr = dom.text().split('eval(')[1].replace('{}))', '{})')
            js = execjs.compile('function run(){' + execjs.eval(jsFunctionStr) + 'return newImgs;}')
            imgArr = js.call('run')
            i = 1
            for img in imgArr:
                arr.append({
                    'src': img,
                    'path': (self.options['path'] or './') + '/' + self.options['name'] +'/' + title + '/',
                    'fileName': str(i) + '.jpg'
                })
                i = i + 1
            download(arr, self.options, title)


    