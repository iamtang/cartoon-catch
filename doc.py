#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests
import threading
import time
import random
import string

def url_response(i):
    value = ''.join(random.sample(string.ascii_letters + string.digits, random.randint(5, 15)))
    value2 = ''.join(random.sample(string.ascii_letters + string.digits, random.randint(5, 15)))
    value3 = ''.join(random.sample(string.ascii_letters + string.digits, random.randint(5, 15)))
    r = requests.post('https://h5.ledayun.com.cn/api/userService/register', data={"name": value,"email": value2 + "@qq.com","password": value3})
    
    print(value, value3, r.json())

def run():
    for i in range(0, 10):
        try:
            for i in range(0, 10):
                t = threading.Thread(target=url_response, args=(i,))
                t.start()
        except StopIteration:
            break

        t.join()

run()

