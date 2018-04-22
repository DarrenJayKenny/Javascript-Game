#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage, escape
import pymysql as db

print('Content-Type: text/html')
print()

result = ''
count = 0

try:
    connection = db.connect('cs1.ucc.ie', 'dk11', 'aepeimeu', 'csdipact2017_dk11')
    cursor = connection.cursor(db.cursors.DictCursor)
    cursor.execute("""SELECT DISTINCT username, score
                      FROM Players
                      ORDER BY score DESC""")
    result = '<table><tr><th>Name</th><th>Score</th></tr>'
    while count < 9:
        for row in cursor.fetchall():
            result += '<tr><td>%s</td><td>%i</td></tr>' % (row['username'], row['score'])
            count += 1
    result += '</table>'
    cursor.close()  
    connection.close()

except db.Error:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'
        
        
print("""
    <!DOCTYPE html>
    <html lang ="en">
        <head>
            <meta charset ="utf-8" />
            <title>High Scores</title>
            <link rel="stylesheet" href="ultimateGame.css">
            <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
        </head>
        <body>
            %s
        </body>
            <li><a href="game.py"> Want to try beat those scores? Play now!</a></li>
            <li><a href="login.py"> Login to Account</a></li>
	    <li><a href="logout.py"> Logout of Account</a></li>
	    <li><a href="register.py"> Register New Player </a></li>
    </html>""" % (result))
