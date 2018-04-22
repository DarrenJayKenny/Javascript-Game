#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage, escape
import pymysql as db

print('Content-Type: text/plain')
print()

form_data = FieldStorage()
username = form_data.getfirst('username')
score = form_data.getfirst('score')

try:
    connection = db.connect('cs1.ucc.ie', 'dk11', 'aepeimeu', 'csdipact2017_dk11')
    cursor = connection.cursor(db.cursors.DictCursor)
    cursor.execute("""SELECT *
                      FROM Players
                      WHERE username = %s""" , (username))
    for row in cursor.fetchall():
        if int(score) > int(row["score"]):
            cursor.execute("""UPDATE Players
                          SET score = %s
                          WHERE username = %s""" , (int(score), username))
            connection.commit()
            print('success')
        else:
            print('failure')
    cursor.close()  
    connection.close()

except db.Error:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'
