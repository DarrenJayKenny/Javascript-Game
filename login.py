#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage, escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db

form_data = FieldStorage()
username = ''
result = ''
if len(form_data) != 0:
    username = escape(form_data.getfirst('username', '').strip())
    password = escape(form_data.getfirst('password', '').strip())
    if not username or not password:
        result = '<p>Error: user name and password are required</p>'
    else:
        sha256_password = sha256(password.encode()).hexdigest()
        try:
            connection = db.connect('cs1.ucc.ie', 'dk11', 'aepeimeu', 'csdipact2017_dk11')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM Players
                              WHERE username = %s
                              AND password = %s""", (username, sha256_password))
            if cursor.rowcount == 0:
                result = '<p>Error: incorrect user name or password</p>'
            else:
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sessions/sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['username'] = username
                session_store.close()
                result = """
                   <p>Succesfully logged in!</p>
                   <p>Welcome back to RPVA.</p>
                   <ul>
                       <li><a href="game.py">Ready to Play?</a></li> 
                       <li><a href="logout.py">Logout</a></li>
					   <li><a href="register.py">Register new player</a></li>
					   <li><a href="highScore.py">See highscores?</a></li>
                   </ul>"""
                print(cookie)
            cursor.close()  
            connection.close()
        except (db.Error, IOError):
            result = '<p>Sorry! We are experiencing problems at the moment. Please try again later.</p>'
        
print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Login to RPVA</title>
            <link rel="stylesheet" href="ultimateGame.css">
            <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
        </head>
        <body>
            <form action="login.py" method="post">
                <label for="username">User name: </label>
                <input type="text" name="username" id="username" value="%s" />
                <label for="password">Password: </label>
                <input type="password" name="password" id="password" />
                <input type="submit" value="Login" />
            </form>
            <p> Don't have an account? <a href="register.py">Register</a> here for free! </p>
            %s
        </body>
    </html>""" % (username, result))
