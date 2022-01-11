import sqlite3
import json
import os
import sys
import web

con = sqlite3.connect(
    os.path.split(os.path.realpath(sys.argv[0]))[0] + "/words.db",
    check_same_thread=False,
)


class data:
    def read():
        dic = {}
        cur = con.cursor().execute("SELECT word, value FROM words")
        for i in cur:
            dic[i[0]] = i[1]
        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[0] + "/config.json", "r"
        ) as file:
            main_dic = json.loads(file.read())
            main_dic["word_value"] = dic
            return json.dumps(main_dic)

    def write(w, v):
        con.cursor().execute(
            "INSERT INTO words(word,value) VALUES(?,?)\
        ON CONFLICT(word) DO UPDATE SET value=?;",
            (w, v, v),
        )
        con.commit()


urls = ("/", "index")


class index:
    def GET(self):
        web.header("Access-Control-Allow-Origin", "*")
        return data.read()

    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")
        web_data = json.loads(web.data().decode("UTF-8"))
        print(web_data)
        if "word_value" in web_data:
            for key in web_data["word_value"]:
                data.write(key, web_data["word_value"][key])
            with open(
                os.path.split(os.path.realpath(sys.argv[0]))[0] + "/config.json", "w+"
            ) as file:
                del web_data["word_value"]
                json.dump(web_data, file)
        web_data = None


if __name__ == "__main__":
    app = web.application(urls, globals())
    web.httpserver.runsimple(app.wsgifunc(), ("0.0.0.0", 8888))
