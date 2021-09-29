import sqlite3
import json
import os

con = sqlite3.connect('lookup.db')
cur = con.cursor().execute('SELECT topic_id, word, accent, mean_cn FROM dict_bcz')

dic_data={}
word2id={}

for row in cur:
    dic_data[row[0]]=[row[1],row[2],row[3]]
    word2id[row[1]]=row[0]
print(word2id)

dic_file=open('dic.js','w')
dic_file.write('dic='+str(dic_data))


filelist=os.listdir('json/')
filelist.sort()
for item in filelist:
    print(item)

map_js_file=open('map.js','w')
c={}
w2i=word2id
for item in filelist:
    name=item[3:]
    if(item[-3:]!='txt'):
        c[name]=[]
        list=json.load(open('json/'+item))
        for i in list:
            c[name].append(i['topic_id'])
    else:
        c[name[:-4]]=[]
        list=open('json/'+item).read()
        list=list.split('\n')
        for i in list:
            if(i in w2i):
                c[name[:-4]].append(w2i[i])
    
map_js_file.write('map='+json.dumps(c)+';')


map_js_file.close()

con.close()