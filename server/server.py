import json
import os
import sys
import web

class data:
    def read():
        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[0] + "/data.json", "r"
        ) as file:
            main_dic = json.loads(file.read())
            return json.dumps(main_dic)

    def write(web_data):
        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[0] + "/data.json", "w+"
        ) as file:
            json.dump(web_data, file)

urls = ("/", "index")


class index:
    def GET(self):
        web.header("Access-Control-Allow-Origin", "*")
        return data.read()

    def POST(self):
        web.header("Access-Control-Allow-Origin", "*")
        web_data = json.loads(web.data().decode("UTF-8"))
        data.write(web_data)
        web_data = None


if __name__ == "__main__":
    app = web.application(urls, globals())
    web.httpserver.runsimple(app.wsgifunc(), ("0.0.0.0", 8888))
