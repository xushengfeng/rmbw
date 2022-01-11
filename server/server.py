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
        syllable_dic = {}
        sy_cur = con.cursor().execute("SELECT word, value FROM syllable")
        for k in sy_cur:
            syllable_dic[k[0]] = k[1]
        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[0] + "/config.json", "r"
        ) as file:
            main_dic = json.loads(file.read())
            main_dic["word_value"] = dic
            main_dic["syllable_l"] = syllable_dic
            return json.dumps(main_dic)

    def write(w, v):
        con.cursor().execute(
            "INSERT INTO words(word,value) VALUES(?,?)\
        ON CONFLICT(word) DO UPDATE SET value=?;",
            (w, v, v),
        )
        con.commit()

    def write_sy(w, v):
        con.cursor().execute(
            "INSERT INTO syllable(word,value) VALUES(?,?)\
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
        if "word_value" in web_data:
            for key in web_data["word_value"]:
                data.write(key, web_data["word_value"][key])

        if "syllable_l" in web_data:
            for key in web_data["syllable_l"]:
                data.write_sy(key, web_data["syllable_l"][key])

        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[0] + "/config.json", "w+"
        ) as file:
            if "word_value" in web_data:
                del web_data["word_value"]
            if "syllable_l" in web_data:
                del web_data["syllable_l"]
            json.dump(web_data, file)
        web_data = None


if __name__ == "__main__":
    app = web.application(urls, globals())
    web.httpserver.runsimple(app.wsgifunc(), ("0.0.0.0", 8888))
