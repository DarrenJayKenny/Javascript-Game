#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = '<p>You are already logged out</p>'
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sessions/sess_' + sid, writeback=True)
            session_store['authenticated'] = False
            session_store.close()
            result = """
                <p>You have logged out. Thanks for playing RPVA</p>
                <p><a href="login.py">Login</a></p>
                <p><a href="highScore.py">See highscores?</a></p>
                <p><a href="register.py">Register new player?</a></p>"""
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>RPVA</title>
            <link rel="stylesheet" href="ultimateGame.css">
            <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
        </head>
        <body>
            %s
        </body>
    </html>""" % (result))
