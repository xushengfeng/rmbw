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
        cur = con.cursor().execute('SELECT word, value FROM words')
        con.cursor().execute('INSERT INTO words(word,value)')
        con.cursor().execute('VALUES("'+w+'",'+v+')')


urls = (
    '/', 'index'
)


class index:
    def GET(self):
        return data.read()

    # def POST(self):
        # data = web.data()
        # return json.dumps((ocr(data, 'en')))


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
