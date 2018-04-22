#!/usr/local/bin/python3

from cgitb import enable
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = 'Unknown'

try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in  cookie:
            sid = cookie['sid'].value
            session_store = open('sessions/sess_' + sid, writeback = False)
            result = session_store.get('username')
            session_store.close()
        print(result)
except IOError:
    print(result)
