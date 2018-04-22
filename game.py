#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = """
   <p>You do not have permission to access this page.</p>
   <ul>
       <li><a href="register.py">Register</a></li>
       <li><a href="login.py">Login</a></li>
   </ul>"""
   
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sessions/sess_' + sid, writeback=False)
            if session_store.get('authenticated'):
                result = """
				<p> Press (S) to start the game! Use the arrow keys to control your heroes! </p>
				<p> You need to catch the coins, make it to the island and avoid pirates, stop the dragon from landing, and make it through an astroid storm! </p>
				<p> Easy, right? Good luck %s !</p>
				<div>
					<canvas id="catcher" width="400" height="400">
					</canvas>

					<canvas id="dodger" width="400" height="400">
					</canvas>

					<canvas id="breaker" width="400" height="400">
					</canvas>

					<canvas id="space" width="400" height="400">
					</canvas><br>
				</div>
				<p><a href="http://cs1.ucc.ie/~dk11/cgi-bin/lab7/highScore.py"> See the highscores!</a></p>
		    		<p><a href="http://cs1.ucc.ie/~dk11/cgi-bin/lab7/game.py">Retry</a></p>
	    			<p><a href="http://cs1.ucc.ie/~dk11/cgi-bin/lab7/logout.py">Logout</a></p>
                    """ % session_store.get('username')
            session_store.close()
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

print("""
<!DOCTYPE html>
	<head>
        <meta charset="utf-8" />
        <title>R.P.V.A</title>
        <link rel="stylesheet" href="ultimateGame.css">
        <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
        <script src="UltimateGame.js">
        </script>
    </head>
    <body>
	<h1> Rogues, Pirates, Vikings and Astronauts </h1>
	%s
    </body>
    </html>""" % (result))
