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
        r = json.loads(data.read())
        with open(
            os.path.split(os.path.realpath(sys.argv[0]))[
                0] + "/data.json", "w+"
        ) as file:
            a = update_dic(r, web_data)
            json.dump(a, file)
            r = None


def update_dic(a, web_dic):
    new_dic = {}
    new_dic = a
    # 鉴于这个项目数据，只嵌套一层
    for i in web_dic:
        if i in new_dic:
            # 防止网页端数据丢失而覆盖
            if len(new_dic[i]) <= len(web_dic[i]):
                new_dic[i] = web_dic[i]
        else:
            new_dic[i] = web_dic[i]
    return new_dic


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
