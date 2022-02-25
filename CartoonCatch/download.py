import os
import requests
from tqdm import tqdm
import threading

lock = threading.Lock()

def url_response(url,tq):
    myfile = requests.get(url['src'], headers={"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1"})
    creatDir(url['path'])
    open(url['path'] + url['fileName'], 'wb').write(myfile.content)
    tq.update(1)


def download(urls, options, title):
    threads_num = options.get('threads_num', 5)
    tq = tqdm(range(len(urls)))
    tq.set_description(options['name'] + title)
    it = iter(urls)
    while True:
        try:
            for i in range(0, threads_num):
                img = next(it)
                t = threading.Thread(target=url_response, args=(img,tq))
                t.start()
        except StopIteration:
            break
        
        t.join()

    # while len(urls) > 0:
    #     threads_num = threads_num if threads_num < len(urls) else len(urls)
    #     for i in range(0, threads_num):
    #         img = urls.pop(0)
    #         t = threading.Thread(target=url_response, args=(img,))
    #         t.start()
    #         tq.update(1)
    
    #     t.join()
   
        
    
def creatDir(path):
    if not os.path.exists(path):
        os.makedirs(path)