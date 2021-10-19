import sqlite3
import json
import os
import sys
import web

con = sqlite3.connect(os.path.split(
    os.path.realpath(sys.argv[0]))[0]+'/words.db', check_same_thread=False)


class data:
    def read():
        dic = {}
        cur = con.cursor().execute('SELECT word, value FROM words')
        for i in cur:
            dic[i[0]] = i[1]
        return json.dumps(dic)

    def write(w, v):
        con.cursor().execute("INSERT INTO words(word,value) VALUES(?,?)\
        ON CONFLICT(word) DO UPDATE SET value=?;", (w, v, v))
        con.commit()


urls = (
    '/', 'index'
)


class index:
    def GET(self):
        web.header("Access-Control-Allow-Origin", "*")
        return data.read()

    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")
        web_data = json.loads(web.data().decode('UTF-8'))
        data.write(web_data['word'], web_data['value'])


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
